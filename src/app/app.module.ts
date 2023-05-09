import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastModule } from 'primeng/toast';

import { AuthInterceptor } from './interceptors/auth.interceptors';
import { NgxLoadingModule } from 'ngx-loading';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppConfigService } from './services/app-config.service';
import { FooterComponent } from './components/footer/footer.component';
import {MessageModule} from 'primeng/message'
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastModule,
    HttpClientModule,
    MessageModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff',
    }),
  ],
  providers: [
    AppConfigService,
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      multi: true,
      deps: [AppConfigService],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  static injector : Injector;
  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}

export function init(config:AppConfigService){
  return () => config.load();
}
