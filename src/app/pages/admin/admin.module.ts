import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { AdminSideBarComponent } from 'src/app/components/admin-side-bar/admin-side-bar.component';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/custom/shared/shared.module';
import { CategoryComponent } from './category/category.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './users/users.component';


const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'categories', component: CategoryManagementComponent }
    ]
  }
]

@NgModule({
  declarations: [
    AdminComponent,
    AdminSideBarComponent,
    CategoryComponent,
    CategoryManagementComponent,
    UsersComponent,
  ],
  entryComponents: [CategoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule,
    ButtonModule,
    PaginatorModule,
    DropdownModule,
    SharedModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AdminModule { }
