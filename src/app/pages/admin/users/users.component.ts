import { Component } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { UserApi } from 'src/app/api/v1/user.api';
import { GetUserRequest } from 'src/app/models/get-user-request';
import { UserResponse } from 'src/app/models/user-response';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  users: UserResponse[];
  totalRecords = 0;
  loading = false;
  take = 10;
  clonedUsers: { [s: string]: UserResponse } = {};

  constructor(
    private userApi: UserApi,
    private loadingService: LoadingService,
    private messageService: MessageService
  ) { }


  loadUsers(event: LazyLoadEvent) {
    setTimeout(() => {
      this.loading = true;
      const skip = event.first;
      this.userApi.getUsers({ skip: skip, take: this.take } as GetUserRequest).subscribe(res => {
        this.loading = false;
        if (res.success) {
          this.users = res.items;
          this.totalRecords = res.count;
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
        }
      })
    }, 1000);
  }
}
