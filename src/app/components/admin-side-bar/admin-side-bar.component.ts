import { Component, ElementRef, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
declare var $: any;
import { filter } from 'rxjs';
@Component({
  selector: 'app-admin-side-bar',
  templateUrl: './admin-side-bar.component.html',
  styleUrls: ['./admin-side-bar.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class AdminSideBarComponent implements OnInit{

  pages = [
    'products',
    'home',
    'users',
    'categories'
  ];
  selectedMenu: string = '';
  constructor(private router:Router, private _elementRef: ElementRef){
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((observer: any) => {
        this.closeSidebar();
        let page = '';
        page = this.pages.find((x) => observer.url.includes(x));
        if (page) this.selectedMenu = page;
        else this.selectedMenu = null;
      });

    if (!this.selectedMenu) {
      let url = this.router.url.replace('/adminPanel/', '');
      if (this.pages.indexOf(url) != -1) {
        this.selectedMenu = url;
      }
    }
  }

  onClick(event) {
    if (
      !this._elementRef.nativeElement.contains(event.target) &&
      !event.target.className.includes('logo-sidebar')
    ) {
      this.closeSidebar();
      // or some similar check
    }
  }

  showSidebar() {
    $('#logo-sidebar').delay(500).removeClass('-translate-x-full');
  }

  closeSidebar() {
    $('#logo-sidebar').delay(500).addClass('-translate-x-full');
  }
}
