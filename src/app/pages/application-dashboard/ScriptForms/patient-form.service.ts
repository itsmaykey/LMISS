
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDashboardService } from '../service/application-dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class PatientFormService {
  constructor(private fb: FormBuilder, private dashboardService: ApplicationDashboardService) {}

  createPatientForm(userInfo: any): FormGroup {
    const customUUID = (): string => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let uuid = 'DDNPQR-';
      for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        uuid += chars[randomIndex];
      }
      return uuid;
    };

    return this.fb.group({
      patientCode: [customUUID(), Validators.required],
      pFirstName: ['', Validators.required],
      pMiddleName: [''],
      pLastName: ['', Validators.required],
      pExtName: [''],
      pNickName: ['', Validators.required],
      sex: ['', Validators.required],
      birthdate: ['', Validators.required],
      prkCode: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      birthplace: ['', Validators.required],
      nationalityId: ['', Validators.required],
      religionId: ['', Validators.required],
      civilStatusId: ['', Validators.required],
      educationalId: ['', Validators.required],
      schoolLastAttended: ['', Validators.required],
      yearGraduated: ['', Validators.required],
      occupation: ['', Validators.required],
      income: ['', Validators.required],
      admittingStaffId: [userInfo.id, Validators.required],
      caseNo: ['12', Validators.required],
      referrefBy: [userInfo.name, Validators.required],
    });
  }

  submitPatientForm(patientForm: FormGroup): void {
    if (patientForm.valid) {
      const patientFormData = patientForm.value;
      this.dashboardService.postPatientData(patientFormData).subscribe({
        next: (response) => {
          console.log('User registered successfully:', response);
          alert('User registered successfully!');
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
        },
      });
    } else {
      console.warn('Form submission attempted with invalid data:', patientForm.value);
      alert('Please fill in all required fields correctly.');
    }
  }
}
