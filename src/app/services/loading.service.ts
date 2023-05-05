import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class LoadingService {
  public loadingBehaviour: BehaviorSubject<boolean> ;

  constructor() {
    this.loadingBehaviour = new BehaviorSubject<boolean>(null);
  }
  private _loading: boolean;
  public set loading(value: boolean) {
    this.loadingBehaviour.next(null);
    this.loadingBehaviour.next(value);
    this._loading = value;
  }

  public get loading() {
    return this._loading;
  }
}
