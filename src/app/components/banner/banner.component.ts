import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  constructor(
    private loadingService: LoadingService,
  ) {}


  images : any[] = [
    {name:'assets/img/Camera1.png', title:'Camera 1'},
    {name:'assets/img/Camera2.png', title:'Camera 2'},
    {name:'assets/img/Camera3.png', title:'Camera 3'},
    {name:'assets/img/Camera4.png',title:'Camera 4'},
    {name:'assets/img/Camera5.png',title:'Camera 5'},
    {name:'assets/img/Camera6.png',title:'Camera 6'},
    {name:'assets/img/Camera7.png',title:'Camera 7'},
    {name:'assets/img/Camera8.png',title:'Camera 8'},
    {name:'assets/img/Camera9.png',title:'Camera 9'},

  ];

  // public carouselTileItems: Array<any> = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  // public carouselTiles = {
  //   0: [],
  //   1: [],
  //   2: [],
  //   3: [],
  //   4: [],
  //   5: [],
  //   6: [],
  //   7: [],
  //   8: [],
  // };
  // public carouselTile: NguCarouselConfig = {
  //   grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
  //   slide: 5,
  //   speed: 250,
  //   point: {
  //     visible: true,
  //   },
  //   load: 3,
  //   velocity: 0,
  //   touch: true,
  //   easing: 'cubic-bezier(0, 0, 0.2, 1)',
  // };

  ngOnInit(): void {
    //this.getAllProducts();

  }

  // public carouselTileLoad(j) {
  //   // console.log(this.carouselTiles[j]);
  //   const len = this.carouselTiles[j].length;
  //   if (len <= 30) {
  //     for (let i = len; i < len + 15; i++) {
  //       this.carouselTiles[j].push(
  //         this.images[Math.floor(Math.random() * this.images.length)]
  //       );
  //     }
  //   }
  // }



}
