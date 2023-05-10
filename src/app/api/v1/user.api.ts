import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApi } from "../base.api";
import { Router } from '@angular/router';
import { AppConfigService } from 'src/app/services/app-config.service';
import { TokenStoreService } from 'src/app/services/token-store.service';
import { MessageService } from 'primeng/api';
import { LoadingService } from 'src/app/services/loading.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegisterUserRequest } from 'src/app/models/register-user-request';
import { BaseCommandResponse, BaseCommandResponse2 } from 'src/app/models/base-command.dto';
import { UserDto } from 'src/app/models/user.dto';
import { LoginUserRequest } from 'src/app/models/login-user-request';
import { LoginUserResponse } from 'src/app/models/login-user-response';
import { LogoutRequest } from 'src/app/models/logout-request';
import { GetUserRequest } from 'src/app/models/get-user-request';
import { BaseQueryResponse } from 'src/app/models/base-query-response.dto';
import { UserResponse } from 'src/app/models/user-response';
import { UpdateUserRequest } from 'src/app/models/update-user-request';

@Injectable({ providedIn: 'root' })
export class UserApi extends BaseApi {
  constructor(
    http: HttpClient,
    router: Router,
    private configUser: AppConfigService,
    private tokenStoreService: TokenStoreService,
    messageService: MessageService,
    loadingSevice: LoadingService
  ) {
    super(http, configUser, router, 'User', messageService, loadingSevice);
  }

  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject(null);
  public closeUserDropDownMenu: BehaviorSubject<boolean> = new BehaviorSubject(null);

  _logged: boolean = false;

  public set logged(value: boolean) {
    this.loggedIn.next(null);
    this.loggedIn.next(value);
    this._logged = value;
  }

  public get logged() {
    return this._logged;
  }

  public notifyCloseUserDropDownMenu() {
    this.closeUserDropDownMenu.next(null);
    this.closeUserDropDownMenu.next(true);
  }



  register(user: RegisterUserRequest): Observable<BaseCommandResponse2<UserDto>> {
    return this.post(user, 'register');
  }

  login(user: LoginUserRequest): Observable<BaseCommandResponse2<LoginUserResponse>> {
    return this.post(user, 'login');
  }

  logout(logoutDto: LogoutRequest): Observable<BaseCommandResponse> {
    return this.post(logoutDto, 'logout');
  }

  getUsers(request: GetUserRequest): Observable<BaseQueryResponse<UserResponse>> {
    return this.getByParam('getUsers', request);
  }

  getUserById(userId: string): Observable<BaseQueryResponse<UserResponse>> {
    return this.getByParam('getUserById', { userId: userId });
  }

  updateUser(request: UpdateUserRequest): Observable<BaseCommandResponse2<UserResponse>> {
    return this.post(request, 'updateUser');
  }

  getAuthUser() {
    if (!this.isAuthUserLoggedIn()) {
      return null;
    }

    const decodedToken = this.tokenStoreService.getDecodedAccessToken();

    return <UserDto>Object.freeze({
      id: decodedToken.sub,
      userName: decodedToken.unique_name,
      fullName: decodedToken.given_name,
      email: decodedToken.email,
      isAdmin: (decodedToken.isAdmin == true || decodedToken.isAdmin == 'True') ? true : false,
      accessToken: '',
      refreshToken: '',
      // user: user
    });
  }


  // ----------------------------------------------------
  isAuthUserLoggedIn(): boolean {
    const access = this.tokenStoreService.hasStoredAccessAndRefreshTokens();
    const expired = this.tokenStoreService.isAccessTokenTokenExpired();

    return access && !expired;
  }
}
