import { Component } from '@angular/core';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  _ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  title = 'colorFull';
  loading: boolean = false;

  constructor(private loadingService:LoadingService) {
    this.loadingService.loadingBehaviour.subscribe((isLoading) => {
      this.loading = isLoading;
    });
  }

}
