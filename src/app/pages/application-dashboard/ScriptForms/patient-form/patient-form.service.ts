import { ActivatedRoute, Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import { OnInit } from '@angular/core';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class PatientFormService {
  isSubmitting: boolean = false; 
 existed: any;
  constructor(
      private fb: FormBuilder,
      private dashboardService: ApplicationDashboardService,
      private route: ActivatedRoute,
      private router: Router) {}


  ngOninit(): void {

 this.route.paramMap.subscribe((params) => {
   const patientCode = params.get('patientCode');
   if (patientCode) {
     this.existed = this.dashboardService.getExistedPatientData(patientCode);
     console.log('ExistedPatient:', this.existed);
     this.router.navigate(['/application', this.existed]);

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
      this.isSubmitting = true;
      this.dashboardService.postPatientData(patientFormData).subscribe({
        next: (response) => {
          console.log('User registered successfully:', response);
          Swal.fire({
            title: "Successfully Saved!",
            text: "The patient data has been saved.",
            icon: "success",
            timer: 1000, 
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false
          });
          this.isSubmitting = false;
          this.router.navigate(['/application', patientForm.get('patientCode')?.value]);
          
        },
        
        error: (err) => {
          console.error('API Error:', err);
  
          let errorMessage = "Failed to register user. Please try again.";
          if (err.status === 400) {
            errorMessage = "Validation failed. Please check your inputs.";
          } else if (err.status === 401) {
            errorMessage = "Unauthorized. Please check your permissions.";
          } else if (err.status === 500) {
            errorMessage = "Server error. Please try again later.";
          }
  
          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "OK",
            allowOutsideClick: false,
            allowEscapeKey: false
          });
          this.isSubmitting = false;
        }
      });
    } else {
      console.warn('Form submission attempted with invalid data:', patientForm.value);
      Swal.fire({
        title: "Invalid Submission!",
        text: "Please fill in all required fields correctly.",
        icon: "warning",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      this.isSubmitting = false;
    }
  }
}
