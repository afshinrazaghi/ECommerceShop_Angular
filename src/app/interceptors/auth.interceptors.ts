import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { AuthTokenType } from '../models/enums';
import { TokenStoreService } from '../services/token-store.service';
import { RefreshTokenDto } from '../models/refresh-token.dto';
import { AppConfigService } from '../services/app-config.service';
import { UrlBaseApi } from '../api/v1/url-base.api';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { UserTokenApi } from '../api/v1/user-token.api';
import { MessageService } from 'primeng/api';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  constructor(
    private router: Router,
    private tokenStoreService: TokenStoreService,
    private configService: AppConfigService,
    private urlBaseApi: UrlBaseApi,
    private userTokenApi: UserTokenApi,
    private messageService: MessageService
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.tokenStoreService.getRawAuthToken(
      AuthTokenType.AccessToken
    );
    if (accessToken) {
      if (!request.headers.get('authorization')) {
        request = request.clone({
          headers: request.headers.set(
            'Authorization',
            `Bearer ${accessToken}`
          ),
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status == 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private handle401Error(request, next): Observable<any> {
    const accessToken = this.tokenStoreService.getRawAuthToken(
      AuthTokenType.AccessToken
    );
    const refreshToken = this.tokenStoreService.getRawAuthToken(
      AuthTokenType.RefreshToken
    );

    if (!this.isRefreshing && accessToken && refreshToken) {
      this.isRefreshing = true;
      const url = this.configService.config.apiUrl + 'userToken/refreshToken';
      return this.urlBaseApi
        .post(
          {
            accessToken: accessToken,
            refreshToken: refreshToken,
          } as RefreshTokenDto,
          url
        )
        .pipe(
          switchMap((res: any) => {
            this.isRefreshing = false;
            if (res.success) {
              this.tokenStoreService.setLoginSession(res.item);
              return next.handle(request);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You are unauthorized!' });
              this.tokenStoreService.deleteAuthTokens();
              this.router.navigate(['/login']);
              return null;
            }
          })
        );
    }
    return null;
  }
}
