import { ActivatedRoute, Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDashboardService } from '../service/application-dashboard.service';


@Injectable({
  providedIn: 'root'
})
export class PatientParentFormService {
  

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
        if (patientParentForm.valid) {
          const patientParentFormData = patientParentForm.value;
      
          // Check if fatherName and motherName are empty
          if (!patientParentFormData.fatherName?.trim() || !patientParentFormData.motherName?.trim()) {
            alert('Father Name and Mother Name cannot be empty.');
            return;
          }
      
          console.log('Submitting patient school form:', patientParentFormData);
          this.applicationdashboardService.postPatientParentData(patientParentFormData).subscribe({
            next: (response) => {
              console.log('Parents Data Saved successfully:', response);
              alert('Parents Data Saved successfully');
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
          console.warn('Form submission attempted with invalid data:', patientParentForm.value);
          alert('Please fill in all required fields correctly.');
        }
      }
      
}
