import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { UserRegService } from './service/user-reg.service';
@Component({
  selector: 'app-user-reg',
  templateUrl: './user-reg.component.html',

  styleUrl: './user-reg.component.css'

})
export class UserRegComponent implements OnInit {

service = inject(UserRegService);

positions: any = [];
userData: any = [];

  userForm!: FormGroup;
  userUpForm!: FormGroup;

  isUpdateDisabled: boolean = false;
  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      extName: [''],
      positionCode: ['', Validators.required],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = { ...this.userForm.value };
      delete formData.confirmPassword; 
      formData.isActive = true;
      this.service.postRegistration(formData).subscribe({
        next: (response) => {
          console.log('User registered successfully:', response);
          alert('User registered successfully!');
          this.onReset();
          this.refreshUserList();
        },
        error: (err) => {
          console.error('API Error:', err);
  
          if (err.status === 400) {
            alert('Validation failed. Please check your inputs.');
          } else if (err.status === 401) {
            alert('Unauthorized. Please check your permissions.');
          } else if (err.status === 500) {
            alert('Server error. Please try again later.');
          } else {
            alert('Failed to register user. Please try again.');
          }
        }
      });
    } else {
      console.warn('Form is invalid!');
      alert('Please fill in all required fields correctly.');
    }
  }
  

  onReset() {
    this.userForm.reset();
  }
  ngOnInit(): void {
    this.userUpForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        middleName: [''],
        lastName: ['', Validators.required],
        extName: [''],
        positionCode: ['', Validators.required],
        userName: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    this.service.getPositions().subscribe({
      next: (response) => {
        this.positions = response;
        console.log('Positions:',  this.positions);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
    this.service.getUserList().subscribe({
      next: (response) => {
        this.userData = response;
        console.log('userData:',  this.userData);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
  refreshUserList(): void {
  this.service.getUserList().subscribe({
    next: (response) => {
      this.userData = response;
      console.log('userData:', this.userData);
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
}
  loadExistingUserData(): void {
    const mockUserData = {
      firstName: 'John',
      middleName: 'Doe',
      lastName: 'Smith',
      nameExtension: 'Jr.',
      userType: 'Admin',
      userName: 'johnsmith',
      password: 'password123',
      confirmPassword: 'password123',
    };

    this.userUpForm.patchValue(mockUserData);
  }

  onUpdate(): void {
    if (this.userUpForm.valid) {
      const updatedData = this.userUpForm.value;
      console.log('Updated User Data:', updatedData);

    } else {
      this.userUpForm.markAllAsTouched();
    }
  }
  onUpReset(): void {
    this.userUpForm.reset();
    this.isUpdateDisabled = true;

    const userRegTab = document.querySelector('[data-bs-target="#form-tabs-personal"]');
    if (userRegTab) {
      const tabInstance = new (window as any).bootstrap.Tab(userRegTab);
      tabInstance.show();
    }
  }


}
