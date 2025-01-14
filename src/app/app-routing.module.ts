import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { LoginComponent } from './Auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [


      {
        path: '',
        component: LoginComponent
      },
      { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
 path:'',
 component:MainLayoutComponent,
 children: [
  {
    path:'dashboard',
    component:DashboardComponent
  }
 ]
  },

  // Define the login route


  // routes = [
  //   {
  //     path: 'login'
  //   },
  //   {
  //     path: '' (mao ning layout)
  //     component: (tawagon tong layout nimo nga component name)
  //    chilren: [
  //   {
  //     path: (katong dashboard component nimo)
  //   }
  //   ]

  //   }
  //   ];


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
