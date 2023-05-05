import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AppConfigModel} from '../models/app-config-model';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn:"root"
})
export class AppConfigService{
  public config =<AppConfigModel>{};
  constructor(private http:HttpClient){}

  async load():Promise<any>{
    const promise = await
    firstValueFrom(this.http.get('/assets/config.json'))
    .then((config)=>{
      this.config = <AppConfigModel>config;
    });

    return promise;
  }
}
