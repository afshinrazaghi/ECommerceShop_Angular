import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserApi } from 'src/app/api/v1/user.api';
import { UserDto } from 'src/app/models/user.dto';
import { BrowserStorageService } from 'src/app/services/browser-storage.service';
import { LoadingService } from 'src/app/services/loading.service';
import { TokenStoreService } from 'src/app/services/token-store.service';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class UserDropdownComponent implements OnInit {
  constructor(
    private userApi: UserApi,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private tokenStoreService: TokenStoreService,
    private router: Router,
    private _elementRef: ElementRef,
    private browserStorageService: BrowserStorageService
  ) { }
  @Input() user: UserDto;
  shoppingCartItemsCount: number = 0;
  logout() {
    this.loadingService.loading = true;
    this.userApi.logout({}).subscribe((res) => {
      this.loadingService.loading = false;
      if (res.success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message});
        this.userApi.logged = false;
        this.tokenStoreService.deleteAuthTokens();
        this.browserStorageService.removeLocal("user");
        this.router.navigate(['/login']);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message});
      }
    });
  }



  onClick(event) {
    if (
      !this._elementRef.nativeElement.contains(event.target) &&
      !event.target.className.includes('fa-user')
    ) {
      // or some similar check
      this.userApi.notifyCloseUserDropDownMenu();
    }
  }

  ngOnInit(): void {
    // this.shoppingSessionApi.shoppingCartChanged.subscribe((res) => {
    //   if (res == true) {
    //     if (this.userApi.isAuthUserLoggedIn()) {
    //       this.getShoppingCartItemsCount();
    //     }
    //   }
    // });
    // if (this.userApi.isAuthUserLoggedIn()) {
    //   this.getShoppingCartItemsCount();
    // }
  }
}
