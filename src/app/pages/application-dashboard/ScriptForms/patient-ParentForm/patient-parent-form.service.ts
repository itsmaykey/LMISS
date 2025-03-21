import { ActivatedRoute, Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class PatientParentFormService {
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
        this.existed = this.applicationdashboardService.getExistedPatientParentData(patientCode);
        console.log('ExistedPatient:', this.existed);
      }
    });

      }
      createPatientParentForm(ExistedPatientCode: string, existingPatientParentData: any = {}): FormGroup {

        return this.fb.group({
          patientCode : [ ExistedPatientCode, Validators.required],

          fatherName: [existingPatientParentData.fatherName || '', Validators.required],
          fatherAddress: [existingPatientParentData.fatherAddress || '', Validators.required],
          fatherEducation: [existingPatientParentData.fatherEducation || '', Validators.required],
          fatherOccupation: [existingPatientParentData.fatherOccupation || '', Validators.required],
          fatherIncome: [existingPatientParentData.fatherIncome || '' ,Validators.required],
          fatherStatusId: [existingPatientParentData.fatherStatusId || '', Validators.required],

          motherName: [existingPatientParentData.motherName || '', Validators.required],
          motherAddress: [existingPatientParentData.motherAddress || '', Validators.required],
          motherEducation: [existingPatientParentData.motherEducation || '', Validators.required],
          motherOccupation: [existingPatientParentData.motherOccupation || '', Validators.required],
          motherIncome: [existingPatientParentData.motherIncome || '' ,Validators.required],
          motherStatusId: [existingPatientParentData.motherStatusId || '', Validators.required],
        });
      }
      submitPatientParentForm(patientParentForm: FormGroup): void {
        if (this.isSubmitting) {
            console.warn("Submission in progress, preventing duplicate requests.");
            return; // Prevent multiple submissions
        }
    
        if (patientParentForm.valid) {
            this.isSubmitting = true; // Set isSubmitting to true at the start
            const patientParentFormData = patientParentForm.value;
    
            // Check if fatherName and motherName are empty
            if (!patientParentFormData.fatherName?.trim() || !patientParentFormData.motherName?.trim()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: 'Father Name and Mother Name cannot be empty.',
                });
                this.isSubmitting = false; // Reset isSubmitting on validation error
                return;
            }
    
            console.log('Submitting patient parent form:', patientParentFormData);
            this.applicationdashboardService.postPatientParentData(patientParentFormData).subscribe({
                next: (response) => {
                    console.log('Parents Data Saved successfully:', response);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Parents Data Saved successfully.',
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
            console.warn('Form submission attempted with invalid data:', patientParentForm.value);
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Form',
                text: 'Please fill in all required fields correctly.',
            });
        }
    }
    

}
