import { ActivatedRoute, Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PatientSpouseFormService {
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
         this.existed = this.applicationdashboardService.getExistedPatientSpouseData(patientCode);
         console.log('ExistedPatient:', this.existed);
       }
     });

       }
       createPatientSpouseForm(ExistedPatientCode: string, existingPatientSpouseData: any = {}): FormGroup {

         return this.fb.group({
           patientCode : [ ExistedPatientCode, Validators.required],

           spouseName: [existingPatientSpouseData.spouseName || '', Validators.required],
           spouseNickName: [existingPatientSpouseData.spouseNickName || '', Validators.required],
           spouseAge: [existingPatientSpouseData.spouseAge || '', Validators.required],
           spouseAddress: [existingPatientSpouseData.spouseAddress || '', Validators.required],
           spouseOccupation: [existingPatientSpouseData.spouseOccupation || '' ,Validators.required],
           spouseEmployer: [existingPatientSpouseData.spouseEmployer || '', Validators.required],
           spouseIncome: [existingPatientSpouseData.spouseIncome || '', Validators.required],
           spouseLivingArrangement: [existingPatientSpouseData.spouseLivingArrangement || '', Validators.required],
           spouseEduID: [existingPatientSpouseData.spouseEduID || '', Validators.required],

         });
       }
       submitPatientSpouseForm(patientSpouseForm: FormGroup): void {
        if (this.isSubmitting) {
            console.warn("Submission in progress, preventing duplicate requests.");
            return; // Prevent multiple submissions
        }

        if (patientSpouseForm.valid) {
            this.isSubmitting = true; // Set isSubmitting to true before making the request
            const patientSpouseFormData = patientSpouseForm.value;

            console.log('Submitting patient spouse form:', patientSpouseFormData);

            this.applicationdashboardService.postPatientSpouseData(patientSpouseFormData).subscribe({
                next: (response) => {
                    console.log('Spouse Data Saved successfully:', response);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Spouse data saved successfully.',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(() => {
                        this.isSubmitting = false; // Reset after success alert
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
                        this.isSubmitting = false; // Reset after error alert
                    });
                }
            });
        } else {
            console.warn('Form submission attempted with invalid data:', patientSpouseForm.value);
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Submission!',
                text: 'Please fill in all required fields correctly.',
            });
        }
    }

}
