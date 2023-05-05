import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Route, Router } from '@angular/router';
import {  } from 'primeng/message';
import { throwError, Observable } from 'rxjs';
import { map, catchError, retry, tap } from 'rxjs/operators';
import { AppResult } from '../models/app-result.model';
import { AppConfigService } from '../services/app-config.service';
import { LoadingService } from '../services/loading.service';
import {MessageService} from 'primeng/api';
export class BaseApi {
  public BASE_URL: string;
  public Api_URL: string;
  router: Router;
  constructor(
    protected http: HttpClient,
    configService: AppConfigService,
    router: Router,
    apiUrl: string,
    protected messageService: MessageService,
    protected loadingService: LoadingService
  ) {
    this.BASE_URL = configService.config.apiUrl;
    this.Api_URL = `${this.BASE_URL}${apiUrl}`;
    this.router = router;
    this.messageService = messageService;
    this.loadingService = loadingService;
  }

  public appendHttpParams(params: HttpParams, obj: any): HttpParams {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        params = params.set(key, obj[key]);
      }
    }
    return params;
  }

  getAppResult(url?: string, obj?: any): Observable<AppResult> {
    let httpParams = new HttpParams();

    if (obj) httpParams = this.appendHttpParams(httpParams, obj);

    return this.http
      .get<any>(`${this.Api_URL}/${url || ''}`, {
        params: httpParams,
      })
      .pipe(retry(3), catchError(this.handleError.bind(this)));
  }

  getByParam(url?: string, obj?: any): Observable<any> {
    return this.getAppResult(url, obj).pipe(
      map((res: AppResult) => {
        let result: any;
        if (!res.success) {
          throw res.description;
        } else {
          result = res.data;
        }

        return result || {};
      })
    );
  }

  get(url?: string): Observable<any> {
    return this.getByParam(url);
  }

  find(id: any): Observable<any> {
    const httpUrl = `${this.Api_URL}/find/${id}`;
    return this.get(httpUrl);
  }

  downloadFile(obj: any, url?: string): Observable<Blob> {
    const httpUrl = `${this.Api_URL}/${url || ''}`;
    let httpParams = new HttpParams();
    httpParams = this.appendHttpParams(httpParams, obj);

    return this.http
      .get(httpUrl, {
        params: httpParams,
        responseType: 'blob',
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  post(model: any, url?: string, options?: object): Observable<any> {
    if (!options) {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      options = { headers };
    }

    return this.http
      .post<AppResult>(`${this.Api_URL}/${url || ''}`, model, options)
      .pipe(
        map((res: AppResult) => {
          let result: any;
          if (!res.success) {
            throw res.description;
          } else {
            result = res.data;
          }
          return result || {};
        }),
        catchError(this.handleError.bind(this))
      );
  }

  private handleError(error: any) {
    this.loadingService.loading = false;
    if (typeof error == 'string') {
      return throwError(<string>error);
    }

    if (error.error instanceof ErrorEvent) {
      console.log('An error occured : ', error.error.message);
    } else {
      console.log(
        `Backend returned code ${error.status}, ` + `body was : ${error.error}`
      );
    }

    let errors = [];
    if (error.error?.errors) {
      for (let errorItem in error.error?.errors) {
        for (let errorRec of error.error?.errors[errorItem]) {
          errors.push(errorRec);
        }
      }
    }

    if (error.status != 401) {
      const errorMessage =
        errors.join(',') ||
        error.message ||
        error.error?.description ||
        'Error, Please Try Again!';
      this.messageService.add({severity:'error',summary:'Error', detail: errorMessage});
    }
    return throwError(error.error?.description || 'Error, Please Try Again');
  }
}
