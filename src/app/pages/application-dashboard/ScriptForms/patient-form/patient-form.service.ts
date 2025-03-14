import { ActivatedRoute, Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import { OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatientFormService {

 existed: any;
  constructor(
      private fb: FormBuilder,
      private dashboardService: ApplicationDashboardService,
      private route: ActivatedRoute,) {}


  ngOninit(): void {

 this.route.paramMap.subscribe((params) => {
   const patientCode = params.get('patientCode');
   if (patientCode) {
     this.existed = this.dashboardService.getExistedPatientData(patientCode);
     console.log('ExistedPatient:', this.existed);
   }
 });


  //   this.route.paramMap.subscribe((params) => {
  //     const patientCode = params.get('patientCode');
  //     if (patientCode) {
  //       console.log('Selected Patient Code:', patientCode);
  //       // this.service.getExistedPatientData(patientCode).subscribe({
  //       //   next: (response) => {
  //       //     this.ExistedPatient = response;
  //       //     console.log('ExistedPatient:', this.ExistedPatient);
  //       //   },
  //       //   error: (error) => {
  //       //     console.error('Error:', error);
  //       //   },
  //       // });
  //       }
  //     });
   }


   createPatientForm(userInfo: any, existingPatientData: any = {}): FormGroup {
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
      patientCode: [existingPatientData.patientCode || customUUID(), Validators.required],
      pFirstName: [existingPatientData.pFirstName || '', Validators.required],
      pMiddleName: [existingPatientData.pMiddleName || ''],
      pLastName: [existingPatientData.pLastName || '', Validators.required],
      pExtName: [existingPatientData.pExtName || ''],
      pNickName: [existingPatientData.pNickName || '', Validators.required],
      sex: [existingPatientData.sex || '', Validators.required],
      birthdate: [existingPatientData.birthdate || '', Validators.required],
      citymunCode: [existingPatientData.citymunCode || '', ],
      brgyCode: [existingPatientData.brgyCode || '', ],
      prkCode: [existingPatientData.prkCode || '', Validators.required],
      phoneNumber: [existingPatientData.phoneNumber || '', Validators.required],
      birthplace: [existingPatientData.birthplace || '', Validators.required],
      nationalityId: [existingPatientData.nationalityId || '', Validators.required],
      religionId: [existingPatientData.religionId || '', Validators.required],
      civilStatusId: [existingPatientData.civilStatusId || '', Validators.required],
      educationalId: [existingPatientData.educationalId || '', Validators.required],
      schoolLastAttended: [existingPatientData.schoolLastAttended || '', Validators.required],
      yearGraduated: [existingPatientData.yearGraduated || '', Validators.required],
      occupation: [existingPatientData.occupation || '', Validators.required],
      income: [existingPatientData.income || '', Validators.required],
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
