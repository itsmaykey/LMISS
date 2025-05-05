import { ActivatedRoute } from '@angular/router';

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class PatientHealthHistoryService {

   isSubmitting: boolean = false; 
   patientPersonalHealthForm!: FormGroup;
 
 existed: any;
   constructor(
       private fb: FormBuilder,
       private applicationdashboardService: ApplicationDashboardService,
       private route: ActivatedRoute,) {}
 
 
       ngOnInit(): void {
 
  this.route.paramMap.subscribe((params) => {
    const patientCode = params.get('patientCode');
    if (patientCode) {
      console.log('Patient Code:', patientCode);
      this.existed = this.applicationdashboardService.getExistedPatientHealthHistoryData(patientCode);
      console.log('ExistedPatient:', this.existed);
    }
  });
 
    }
 
 
    createPatientHealthHistoryForm(ExistedPatientCode: string, existingPatientHealthHistoryData: any = {}): FormGroup {
      return this.fb.group({
        patientCode: [ExistedPatientCode, Validators.required],
        patientHealthHistory: [existingPatientHealthHistoryData.patientHealthHistory || '', Validators.required],
        patientBloodPressure: [existingPatientHealthHistoryData.patientBloodPressure || '', Validators.required],
        patientHeight: [existingPatientHealthHistoryData.patientHeight || '', Validators.required],
        patientWeight: [existingPatientHealthHistoryData.patientWeight || '', Validators.required],
        patientCr: [existingPatientHealthHistoryData.patientCr || '', Validators.required],
        patientRr: [existingPatientHealthHistoryData.patientRr || '', Validators.required],
        patientTattooMarks: [existingPatientHealthHistoryData.patientTattooMarks || '', Validators.required],
      });
    }
   submitPatientHealthHistoryForm(patientPersonalHealthForm: FormGroup): void {
          if (this.isSubmitting) {
              console.warn("Submission in progress, preventing duplicate requests.");
              return;
          }
      
          if (patientPersonalHealthForm.valid) {
              this.isSubmitting = true;
              const patientHealthHistoryFormData = patientPersonalHealthForm.value;
              console.log('Submitting patient reason form passokkk:', patientHealthHistoryFormData);
              this.applicationdashboardService.postPatientHealthHistoryData(patientHealthHistoryFormData).subscribe({
                  next: (response) => {
                      console.log('Reason Data Saved successfully:', response);
                      Swal.fire({
                          icon: 'success',
                          title: 'Success',
                          text: 'Reason Data Saved successfully.',
                          showConfirmButton: false,
                          timer: 1000, 
                          timerProgressBar: true,
                          allowOutsideClick: false,
                          allowEscapeKey: false
                      }).then(() => {
                          this.isSubmitting = false; 
                      });
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
                          icon: 'error',
                          title: 'Error',
                          text: errorMessage,
                      }).then(() => {
                          this.isSubmitting = false; 
                      });
                  }
              });
          } else {
              console.warn('Form submission attempted with invalid data:', patientPersonalHealthForm.value);
              Swal.fire({
                  icon: 'warning',
                  title: 'Invalid Form',
                  text: 'Please fill in all required fields correctly.',
              });
          }
      }
   
}
