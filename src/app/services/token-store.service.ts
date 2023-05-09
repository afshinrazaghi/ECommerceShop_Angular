import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { AuthTokenType } from '../models/enums';
import { UserDto } from '../models/user.dto';
import { BrowserStorageService } from './browser-storage.service';
import { LoginUserResponse } from '../models/login-user-response';

@Injectable({ providedIn: 'root' })
export class TokenStoreService {
  private rememberMeToken = 'rememberMe_token';

  constructor(private browserStorageToken: BrowserStorageService) {}

  getRawAuthToken(tokenType: AuthTokenType) {
    return this.browserStorageToken.getLocal(AuthTokenType[tokenType]);
  }

  getDecodedAccessToken(): any {
    const token = this.getRawAuthToken(AuthTokenType.AccessToken);
    try {
      return jwt_decode(token || '');
    } catch (ex) {
      return {};
    }
  }

  getAuthUserDisplayName(): string {
    return this.getDecodedAccessToken().DisplayName;
  }

  getAccessTokenExpirationDateUtc(): Date | null {
    const decoded = this.getDecodedAccessToken();
    if (decoded.exp === undefined) return null;
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isAccessTokenTokenExpired(): boolean {
    const expirationDateUtc = this.getAccessTokenExpirationDateUtc();
    if (!expirationDateUtc) return true;

    return !(expirationDateUtc.valueOf() > new Date().valueOf());
  }

  deleteAuthTokens() {
    this.browserStorageToken.removeLocal(
      AuthTokenType[AuthTokenType.AccessToken]
    );
    this.browserStorageToken.removeLocal(
      AuthTokenType[AuthTokenType.RefreshToken]
    );

    this.browserStorageToken.removeLocal(this.rememberMeToken);
  }

  setToken(tokenType: AuthTokenType, tokenValue: string): void {
    if (this.isEmptyString(tokenValue))
      console.error(`${AuthTokenType[tokenType]} is null or empty`);

    if (
      tokenType == AuthTokenType.AccessToken &&
      this.isEmptyString(tokenValue)
    )
      throw new Error("AccessToken can't be null or empty");

    this.browserStorageToken.setLocal(AuthTokenType[tokenType], tokenValue);
  }

  getDecodedTokenRoles(): string[] | null {
    const decodedToken = this.getDecodedAccessToken();
    const roles =
      decodedToken[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];
    if (!roles) return null;

    if (Array.isArray(roles)) {
      return roles.map((role) => role.toLowerCase());
    } else {
      return [roles.toLowerCase()];
    }
  }

  isEmptyString(value: string): boolean {
    return !value || value.length === 0;
  }

  setLoginSession(response:LoginUserResponse):void{
    this.setToken(AuthTokenType.AccessToken, response.accessToken);
    this.setToken(AuthTokenType.RefreshToken,response.refreshToken);
  }

  rememberMe():boolean{
    return this.browserStorageToken.getLocal(this.rememberMeToken) == true;
  }

  setRememberMe(value:boolean):void{
    this.browserStorageToken.setLocal(this.rememberMeToken,value);
  }

  hasStoredAccessAndRefreshTokens():boolean{
    const accessToken = this.getRawAuthToken(AuthTokenType.AccessToken);
    const refereshToken = this.getRawAuthToken(AuthTokenType.RefreshToken);
    return !this.isEmptyString(accessToken) && !this.isEmptyString(refereshToken);
  }
}
