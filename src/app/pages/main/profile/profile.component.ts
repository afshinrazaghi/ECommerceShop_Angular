import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserApi } from 'src/app/api/v1/user.api';
import { UpdateUserRequest } from 'src/app/models/update-user-request';
import { UserResponse } from 'src/app/models/user-response';
import { BrowserStorageService } from 'src/app/services/browser-storage.service';
import { LoadingService } from 'src/app/services/loading.service';
import { TokenStoreService } from 'src/app/services/token-store.service';
import { UpdateUservalidator } from 'src/app/validators/update-user-validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: UserResponse;
  constructor(
    private formBuilder: FormBuilder,
    private userApi: UserApi,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private tokenStoreService: TokenStoreService,
    private router: Router,
    private browserStorageService: BrowserStorageService,
  ) {

  }

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      email: [{ value: '', disabled: true }],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.minLength(6)]
    });

    this.getUserById();
  }

  onSubmit() {
    const model = this.profileForm.value as UpdateUserRequest;
    model.id = this.user.id;
    const validator = new UpdateUservalidator();
    const validationResult = validator.validate(model);
    const messages = [];
    for (const field in validationResult) {
      messages.push(validationResult[field]);
    }

    if (messages.length == 0) {
      this.loadingService.loading = true;
      this.userApi.updateUser(model).subscribe(res => {
        this.loadingService.loading = false;
        if (res.success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.browserStorageService.setLocal('user', JSON.stringify(res.item));
          this.userApi.logged = true;
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
        }
      });
    }
    else {
      Swal.fire('Warning', messages.join('<br />'), 'warning');
      return;
    }

  }


  getUserById() {
    if (this.userApi.isAuthUserLoggedIn()) {
      this.getAuthUser();
    } else {
      this.messageService.add({ severity: 'warning', summary: 'Warning', detail: 'User Not Authorized!' });
      setTimeout(() => {
        this.router.navigate(['/login'], { queryParams: { returnUrl: "/profile" } });
      }, 500);
    }
  }

  getAuthUser() {
    let userId = this.userApi.getAuthUser().id;
    this.loadingService.loading = true;
    this.userApi.getUserById(userId).subscribe((res) => {
      this.loadingService.loading = false;
      if (res.success) {
        this.user = res.item;
        this.profileForm.patchValue(res.item);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
      }
    });
  }
}
