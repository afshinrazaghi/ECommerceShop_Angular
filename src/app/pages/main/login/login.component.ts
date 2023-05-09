import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserApi } from 'src/app/api/v1/user.api';
import { LoginUserRequest } from 'src/app/models/login-user-request';
import { BrowserStorageService } from 'src/app/services/browser-storage.service';
import { LoadingService } from 'src/app/services/loading.service';
import { TokenStoreService } from 'src/app/services/token-store.service';
import { LoginUserValidator } from 'src/app/validators/login-user.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private userApi: UserApi,
    private messageServie: MessageService,
    private router: Router,
    private loadingService: LoadingService,
    private tokenStoreService: TokenStoreService,
    private browserStorageService: BrowserStorageService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    if (this.userApi.isAuthUserLoggedIn()) {
      this.router.navigate(['/home']);
    }

    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  onSubmit() {
    const validator = new LoginUserValidator();
    const loginModel = this.loginForm.value as LoginUserRequest;
    const validationResult = validator.validate(loginModel);

    const messages = [];
    for (const field in validationResult) {
      messages.push(validationResult[field]);
    }

    if (messages.length == 0) {
      this.loadingService.loading = true;
      this.userApi.login(loginModel).subscribe(res => {
        this.loadingService.loading=false;
        if (res.success) {
          this.messageServie.add({severity: 'success', summary:'Success',detail: res.message });
          this.tokenStoreService.setLoginSession(res.item);
          this.browserStorageService.setLocal('user',JSON.stringify(res.item));
          this.userApi.logged=true;
          if(this.returnUrl){
            this.router.navigate([this.returnUrl]);
          }
          else{
            this.router.navigate(['/home']);
          }
        }
        else {
          this.messageServie.add({severity: 'error', summary:'Error',detail: res.message });
        }
      })
    }
    else {
      Swal.fire('error', messages.join("<br />"), 'error');
    }
  }
}
