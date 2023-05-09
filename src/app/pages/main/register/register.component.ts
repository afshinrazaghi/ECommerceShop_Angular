import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { LoadingService } from 'src/app/services/loading.service';
import { lastValueFrom } from 'rxjs';
import { BrowserStorageService } from 'src/app/services/browser-storage.service';
import { TokenStoreService } from 'src/app/services/token-store.service';
import { validateConfirmPassword } from 'src/app/validators/validateConfirmPasswords';
import { RegisterUserValidator } from '../../../validators/register-user.validator';
import { RegisterUserRequest } from 'src/app/models/register-user-request';
import Swal from 'sweetalert2';
import { UserApi } from 'src/app/api/v1/user.api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private loadinService: LoadingService,
    private browserStorageService: BrowserStorageService,
    private tokenStoreService: TokenStoreService,
    private userApi: UserApi
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      {
        validators: [validateConfirmPassword]
      }
    );
  }

  onSubmit() {

    const validator = new RegisterUserValidator();
    const registerUserViewModel = this.registerForm.value as RegisterUserRequest;
    const validationResult = validator.validate(registerUserViewModel);
    let message = [];
    for (let field in validationResult) {
      message.push(validationResult[field]);
    }

    if (message.length == 0) {
      this.loadinService.loading = true;
      this.userApi.register(registerUserViewModel).subscribe(res => {
        this.loadinService.loading=false;
        if (res.success) {
          this.messageService.add({ severity: 'success', summary: "Success", detail: res.message });
          this.router.navigate(['/login']);
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message } as Message)
        }
      });
    }
    else {
      Swal.fire('Validation Error', message.join('<br />'), 'error');
    }
  }
}
