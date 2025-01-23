import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

 constructor(private service: LoginService, private router: Router) { }
 username: string = '';
 password: string = '';
 LoginData: any;
  ngOnInit(): void {

  }

// loginForm!: FormGroup;
// constructor(private fb: FormBuilder) {
//   this.loginForm = this.fb.group({
//     username: ['', [Validators.required, Validators.minLength(3)]],
//     password: ['', [Validators.required, Validators.minLength(6)]],
//   });
// }


onLogin() {
  // console.log(this.username, this.password);
this.service.PostLogin(this.username, this.password).subscribe({
  next: (response) => {
    this.LoginData = response;
    if(this.LoginData != null){
      console.log('Data:', this.LoginData);
      this.router.navigate(['/dashboard']);
    }
    else {
      alert('Invalid Username or Password');
    }




}
}) }



}
