import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
<<<<<<< HEAD
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
=======
>>>>>>> 7dd2b81167d5e5338225b7967260acf04674c0c2


@NgModule({
  declarations: [
    AppComponent,
    LoginLayoutComponent,
    MainLayoutComponent,
<<<<<<< HEAD
    DashboardComponent,
    ClientDashboardComponent

=======
    DashboardComponent
    
>>>>>>> 7dd2b81167d5e5338225b7967260acf04674c0c2
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxScannerQrcodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
