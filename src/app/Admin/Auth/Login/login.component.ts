import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { AuthService } from '../AuthService';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  {

 constructor(private service: LoginService, private router: Router, private authService: AuthService) { }
username: string = '';
password: string = '';
isLoading = false;

onLogin() {
  if (!this.username || !this.password) {
    alert('Username and Password are required.');
    return;
  }
  this.isLoading = true;
  setTimeout(() => {
    this.isLoading = false; // Hide loader after 3 seconds
  }, 3000);
  //console.log(this.username, this.password);
  this.service.PostLogin(this.username, this.password).subscribe({

    next: (response) => {

     // console.log('Response:', response);
      if (response.status === 200 && response.body?.token) {
        const expiresIn = response.body.expiresIn || 3600; // Assuming the response contains expiresIn in seconds
        this.authService.setToken(response.body.token, expiresIn);
        this.authService.setUserInfo({
          id: response.body.staffIdNo, 
          name: response.body.firstName + ' ' + response.body.lastName,
          position: response.body.positionCode,
          positionName: response.body.positionName
          
        });
        console.log('User info stored:', this.authService.getUserInfo());
        
        this.router.navigate(['/dashboard']);
      } else {
        alert('Invalid Username or Password');
      }
    },
    error: (err) => {
      console.error('Error fetching Data:', err);
      if (err.status === 400) {
        alert('Bad Request: Please check your input.');
      } else {
        alert('Invalid Username or Password');
      }
    },
  });
}
// }) }

// onLogin() {
//   this.service.PostLogin(this.username, this.password).subscribe({
//     next: (response) => {
//       if (response.status === 200 && response.token) {
//         this.authService.setToken(response.token);
//         this.router.navigate(['/dashboard']);
//       } else {
//         alert('Invalid Username or Password');
//       }
//     },
//     error: (err) => {
//       console.error('Error fetching Data:', err);
//       alert('Invalid Username or Password');
//     },
//   });
// }


}
