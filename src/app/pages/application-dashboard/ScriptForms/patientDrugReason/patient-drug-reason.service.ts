import { ActivatedRoute, Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class PatientDrugReasonService {

  isSubmitting: boolean = false; 
 
   existed: any;
   constructor(
       private fb: FormBuilder,
       private applicationdashboardService: ApplicationDashboardService,
       private route: ActivatedRoute,) {}
 
 
   ngOninit(): void {
 
     this.route.paramMap.subscribe((params) => {
       const patientCode = params.get('patientCode');
       if (patientCode) {
         this.existed = this.applicationdashboardService.getExistedPatientDrugReasonData(patientCode);
         console.log('ExistedPatient:', this.existed);
       }
     });
 
       }
       createPatientDrugReasonForm(ExistedPatientCode: string, existingPatientDrugReasonData: any = {}): FormGroup {
 
         return this.fb.group({
           patientCode : [ ExistedPatientCode, Validators.required],
           reasonForUsingDrugs: [existingPatientDrugReasonData.reasonForUsingDrugs || '' ,Validators.required],
           drugEffectCode: [existingPatientDrugReasonData.drugEffectCode || '' ],
           patientSupportVices: [existingPatientDrugReasonData.patientSupportVices || '', Validators.required],
         });
       }
       submitPatientDrugReasonForm(patientDrugReasonForm: FormGroup): void {
         if (this.isSubmitting) {
             console.warn("Submission in progress, preventing duplicate requests.");
             return; // Prevent multiple submissions
         }
     
         if (patientDrugReasonForm.valid) {
             this.isSubmitting = true; // Set isSubmitting to true at the start
             const patientDrugReasonFormData = patientDrugReasonForm.value;
             console.log('Submitting patient reason form:', patientDrugReasonFormData);
             this.applicationdashboardService.postPatientReasonUsingDrugsData(patientDrugReasonFormData).subscribe({
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
                         this.isSubmitting = false; // Reset isSubmitting after alert
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
                         this.isSubmitting = false; // Reset isSubmitting after alert
                     });
                 }
             });
         } else {
             console.warn('Form submission attempted with invalid data:', patientDrugReasonForm.value);
             Swal.fire({
                 icon: 'warning',
                 title: 'Invalid Form',
                 text: 'Please fill in all required fields correctly.',
             });
         }
     }
}
