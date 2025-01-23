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


  userForm!: FormGroup;
  userUpForm!: FormGroup;

  isUpdateDisabled: boolean = false;
  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      nameExtension: [''],
      userType: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form Data:', this.userForm.value);
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
        nameExtension: [''],
        userType: ['', Validators.required],
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    this.loadExistingUserData();
    this.service.getPositions().subscribe({
      next: (response) => {
        this.positions = response;
        console.log('Positions:',  this.positions);
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
      username: 'johnsmith',
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
