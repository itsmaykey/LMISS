import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { LoginComponent } from './Admin/Auth/Login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { UserRegComponent } from './Admin/user-Registration/user-reg.component';
import { ApplicationDashboardComponent } from './pages/application-dashboard/application-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { LoaderComponent } from './layout/loader/loader.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'application/:patientCode', component: ApplicationDashboardComponent }, // Dynamic route for patientCode
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' } // Optional: redirect to dashboard
];

@NgModule({
  declarations: [
    AppComponent,
    LoginLayoutComponent,
    MainLayoutComponent,
    DashboardComponent,
    LoginComponent,
    UserRegComponent,
    ApplicationDashboardComponent,
    LoaderComponent


  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),

    AppRoutingModule,
    NgxScannerQrcodeModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule

  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
