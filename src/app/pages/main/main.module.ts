import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { BannerComponent } from 'src/app/components/banner/banner.component';
import { MainComponent } from './main/main.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from 'src/app/custom/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UserDropdownComponent } from 'src/app/components/user-dropdown/user-dropdown.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutUsComponent } from './about-us/about-us.component';

const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'aboutUs', component: AboutUsComponent }
    ]
  }
]


@NgModule({
  declarations: [
    RegisterComponent,
    HeaderComponent,
    HomeComponent,
    BannerComponent,
    MainComponent,
    LoginComponent,
    UserDropdownComponent,
    ProfileComponent,
    AboutUsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    SharedModule,
    MatNativeDateModule,
    MatDatepickerModule,
    RouterModule.forChild(routes)
  ]
})
export class MainModule { }
