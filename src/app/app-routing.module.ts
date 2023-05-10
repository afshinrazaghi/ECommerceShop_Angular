import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'', loadChildren:()=>import("./pages/main/main.module").then(m=>m.MainModule)},
  {path:'adminPanel', loadChildren:()=>import("./pages/admin/admin.module").then(m=>m.AdminModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
