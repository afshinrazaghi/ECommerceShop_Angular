import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserApi } from '../api/v1/user.api';
import { MessageService } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private userApi: UserApi,
    private router: Router,
    private messageService: MessageService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let isLoggedIn = this.userApi.isAuthUserLoggedIn();
    let user = this.userApi.getAuthUser();
    if (isLoggedIn && user.isAdmin) {
      return true;
    }
    else {
      this.messageService.add({ severity: "error", summary: 'Error', detail: 'Your are not authorized!' })
      this.router.navigate(['/login']);
      return false;
    }
  }

}
