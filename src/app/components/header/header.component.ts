import { Component, HostBinding, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UserDto } from 'src/app/models/user.dto';
import { LoadingService } from 'src/app/services/loading.service';

declare var $;
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { TokenStoreService } from 'src/app/services/token-store.service';
import { BrowserStorageService } from 'src/app/services/browser-storage.service';
import { UserApi } from 'src/app/api/v1/user.api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          visibility: 'visible',
        })
      ),
      state(
        'closed',
        style({
          opacity: 0,
          visibility: 'hidden',
        })
      ),
      transition('open => closed', [animate('0.8s')]),
      transition('closed => open', [animate('0.8s')]),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  currentUser: UserDto;
  shoppingCartItemsCount: number = 0;
  isOpen = false;
  toggle() {
    this.isOpen = !this.isOpen;
  }
  pages = [
    'home',
    'about',
    'personalityTests',
    'contact',
    'login',
    'register',
    'profile',
    'orderYourTrueSelf',
    'whatIsTrueSelf',
    'buyAsGift',
    'checkout/cart'
  ];
  selectedMenu: string = '';
  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private tokenStoreService: TokenStoreService,
    private browserStorageService:BrowserStorageService,
    private userApi:UserApi
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((observer: any) => {
        this.isOpen = false;
        if ($('.navbar-collapse').hasClass('show')) {
          $('.navbar-toggler').click();
        }
        let page = '';
        if (observer.url == '/') page = 'home';
        else page = this.pages.find((x) => observer.url.includes(x));
        if (page) this.selectedMenu = page;
        else this.selectedMenu = null;
      });

    if (!this.selectedMenu) {
      if (this.router.url == '/') {
        this.selectedMenu = 'home';
      } else {
        let url = this.router.url.replace('/', '');
        if (this.pages.indexOf(url) > 0) {
          this.selectedMenu = url;
        }
      }
    }

    // this.userApi.loggedIn.subscribe((res) => {
    //   if (res) {
    //     this.getAuthUser();
    //   } else {
    //     this.currentUser = null;
    //   }
    // });

    // this.getAuthUser();
    // if (this.userApi.isAuthUserLoggedIn()) {
    //   this.getShoppingCartItemsCount();
    // }

    // this.userApi.closeUserDropDownMenu.subscribe((res) => {
    //   if (res == true) {
    //     this.isOpen = false;
    //   }
    // });

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

  get userAuthenticated() {
    return this.userApi.isAuthUserLoggedIn();
  }

  getOpenClosedMenu() {
    //return document.getElementsByClassName("navbar-collapse")[0].className.includes("show") ? 'open':'closed';
  }

  // getAuthUser() {
  //   if (this.userApi.isAuthUserLoggedIn()) {
  //     this.currentUser = this.userApi.getAuthUser();
  //     this.isOpen = false;
  //   }
  // }

  // getShoppingCartItemsCount() {
  //   this.loadingService.loading = true;
  //   return this.shoppingSessionApi
  //     .getShoppingCartItemsCount()
  //     .subscribe((res) => {
  //       this.loadingService.loading = false;
  //       if (res.success) {
  //         this.shoppingCartItemsCount = res.item;
  //       }
  //     });
  // }

  // get userAuthenticated() {
  //   return this.userApi.isAuthUserLoggedIn();
  // }

  // logout() {
  //   this.loadingService.loading = true;
  //   this.userApi.logout({}).subscribe((res) => {
  //     this.loadingService.loading = false;
  //     if (res.success) {
  //       this.notifierService.notify('success', res.message);
  //       this.userApi.logged = false;
  //       this.tokenStoreService.deleteAuthTokens();
  //       this.browserStorageService.removeLocal("user");
  //       this.router.navigate(['/login'], {
  //         queryParams: { returnUrl: '/home' },
  //       });
  //     } else {
  //       this.notifierService.notify('error', res.message);
  //     }
  //   });
  // }


}
