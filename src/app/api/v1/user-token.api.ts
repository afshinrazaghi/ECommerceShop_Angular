import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigService } from 'src/app/services/app-config.service';
import { BaseApi } from '../base.api';
import { Observable } from 'rxjs';

import { LoadingService } from 'src/app/services/loading.service';
import { BaseCommandResponse, BaseCommandResponse2 } from 'src/app/models/base-command.dto';
import { BaseQueryResponse } from 'src/app/models/base-query-response.dto';
import { RefreshTokenDto } from 'src/app/models/refresh-token.dto';
import { UserDto } from 'src/app/models/user.dto';
import {MessageService} from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class UserTokenApi extends BaseApi {
  constructor(
    http: HttpClient,
    router: Router,
    private configUser: AppConfigService,
    messageService: MessageService,
    loadingService: LoadingService
  ) {
    super(http, configUser, router, 'UserToken', messageService, loadingService);
  }


  refreshToken(refreshToken:RefreshTokenDto):Observable<BaseCommandResponse2<UserDto>>{
    return this.post(refreshToken,'refreshToken');
  }

}
