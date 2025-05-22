import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { LoginComponent } from './Admin/Auth/Login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserRegComponent } from './Admin/user-Registration/user-reg.component';
import { PatientDashboardComponent } from './pages/patient-dashboard/patient-dashboard.component';
import { ApplicationDashboardComponent } from './pages/application-dashboard/application-dashboard.component';
import { AuthGuard } from './Admin/Auth/AuthGuard';
import { LoginGuard } from './Admin/Auth/LoginGuard';
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
  { path: 'application/:patientCode', component: ApplicationDashboardComponent },
  { path: 'patientDashboard/:patientCode/:assessmentCode', component: PatientDashboardComponent },
 // Accept dynamic patientCode
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
    path:'application',
    component:ApplicationDashboardComponent
  }
 ]
  },

];



@NgModule({
  imports:
  [
    RouterModule.forRoot(routes),


  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
