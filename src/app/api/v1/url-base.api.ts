import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BaseCommandResponse } from 'src/app/models/base-command.dto';
import { AppConfigService } from 'src/app/services/app-config.service';
import { LoadingService } from 'src/app/services/loading.service';
import { throwError, Observable } from 'rxjs';
import { map, catchError, retry, tap } from 'rxjs/operators';
import { AppResult } from 'src/app/models/app-result.model';
import {MessageService} from 'primeng/api';

@Injectable({providedIn:'root'})
export class UrlBaseApi {
  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private loadingService: LoadingService
  ) {

  }

  post(model: any, url?: string, options?: object): Observable<any> {
    if (!options) {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      options = { headers };
    }

    return this.http
      .post<AppResult>(url, model, options)
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
    this.loadingService.loading=false;
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
    if(error.error?.errors){
      for(let errorItem in  error.error?.errors){
        for(let errorRec of error.error?.errors[errorItem]){
          errors.push(errorRec);
        }

      }
    }

    if(error.status != 401){
      const errorMessage = errors.join(',')  || error.message || error.error?.description  || "Error, Please Try Again!";
      this.messageService.add({severity:'error', summary:'Error', detail:errorMessage });
    }
    return throwError(
      error.error?.description || 'Error, Please Try Again'
    );
  }
}
