
import { ActivatedRoute, Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class SchoolFormService {


existed: any;
  constructor(
      private fb: FormBuilder,
      private applicationdashboardService: ApplicationDashboardService,
      private route: ActivatedRoute,) {}


  ngOninit(): void {

 this.route.paramMap.subscribe((params) => {
   const patientCode = params.get('patientCode');
   if (patientCode) {
     this.existed = this.applicationdashboardService.getExistedPatientData(patientCode);
     console.log('ExistedPatient:', this.existed);
   }
 });

   }


   createPatientSchoolForm(ExistedPatientCode: string, existingPatientSchoolData: any = {}): FormGroup {

    return this.fb.group({
      patientCode : [ ExistedPatientCode, Validators.required],
      patientElementarySchool: [existingPatientSchoolData.patientElementarySchool || '', Validators.required],
      patientElementaryYear: [existingPatientSchoolData.patientElementaryYear || '', Validators.required],
      patientElementaryAddress: [existingPatientSchoolData.patientElementaryAddress || '', Validators.required],
      patientHighScool: [existingPatientSchoolData.patientHighScool || '', Validators.required],
      patientHighSchoolYear: [existingPatientSchoolData.patientHighSchoolYear || '' ,Validators.required],
      patientHighSchoolAddress: [existingPatientSchoolData.patientHighSchoolAddress || '', Validators.required],
      patientCollegeSchool: [existingPatientSchoolData.patientCollegeSchool || '', Validators.required],
      patientCollegeCourse: [existingPatientSchoolData.patientCollegeCourse || '', Validators.required],
      patientColleegeAddress: [existingPatientSchoolData.patientColleegeAddress || '', Validators.required],

    });
  }

  submitPatientSchoolForm(PatientSchoolForm: FormGroup): void {
    if (PatientSchoolForm.valid) {
      console.log(PatientSchoolForm.value);
      const patientShoolFormData = PatientSchoolForm.value;
      console.log('Submitting patient school form:', patientShoolFormData);
      this.applicationdashboardService.postPatientSchoolData(patientShoolFormData).subscribe({
      next: (response) => {
        console.log('School Data Saved successfully:', response);
        Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'School Data Saved successfully',
        timer: 1000, 
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
        });
      },
      error: (err) => {
        console.error('API Error:', err);

        if (err.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Validation failed. Please check your inputs.',
        });
        } else if (err.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'Unauthorized. Please check your permissions.',
        });
        } else if (err.status === 500) {
        Swal.fire({
          icon: 'error',
          title: 'Server Error',
          text: 'Server error. Please try again later.',
        });
        } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to register user. Please try again.',
        });
        }
      },
      });
    } else {
      console.warn('Form submission attempted with invalid data:', PatientSchoolForm.value);
      Swal.fire({
      icon: 'warning',
      title: 'Invalid Form',
      text: 'Please fill in all required fields correctly.',
      });
    }
    }
}
