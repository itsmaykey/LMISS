import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { LoginComponent } from './Auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserRegComponent } from './user-reg/user-reg.component';
import { PatientDashboardComponent } from './dashboard/pages/patient-dashboard/patient-dashboard/patient-dashboard.component';
import { ApplicationDashboardComponent } from './application-dashboard/application-dashboard.component';
import { AuthGuard } from './Auth/login/AuthGuard';
import { LoginGuard } from './Auth/login/LoginGuard';
const routes: Routes = [



      {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuard]
      },
      { path: '', redirectTo: '/login', pathMatch: 'full' },


  {
 path:'',
 component:MainLayoutComponent,
 canActivate: [AuthGuard],
 children: [
  {
    path:'dashboard',
    component:DashboardComponent,

  },
  {
    path:'userReg',
    component:UserRegComponent
  },
  {
    path:'patientDashboard',
    component:PatientDashboardComponent
  },
  {
    path:'applicationDashboard',
    component:ApplicationDashboardComponent
  }
 ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
