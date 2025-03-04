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
        this.existed = this.applicationdashboardService.getExistedPatientData(patientCode);
        console.log('ExistedPatient:', this.existed);
      }
    });
   
      }
      createPatientParentForm(ExistedPatientCode: string, existingPatientParentData: any = {}): FormGroup {

        return this.fb.group({
          patientCode : [ ExistedPatientCode, Validators.required],
          fatherName: [existingPatientParentData.patientElementarySchool || '', Validators.required],
          fatherAddress: [existingPatientParentData.patientElementaryYear || '', Validators.required],
          fatherEducation: [existingPatientParentData.patientElementaryAddress || '', Validators.required],
          fatherOccupation: [existingPatientParentData.patientHighScool || '', Validators.required],
          fatherIncome: [existingPatientParentData.patientHighSchoolYear || '' ,Validators.required],
          fatherStatusId: [existingPatientParentData.patientHighSchoolAddress || '', Validators.required],
        
          motherName: [existingPatientParentData.patientElementarySchool || '', Validators.required],
          motherAddress: [existingPatientParentData.patientElementaryYear || '', Validators.required],
          motherEducation: [existingPatientParentData.patientElementaryAddress || '', Validators.required],
          motherOccupation: [existingPatientParentData.patientHighScool || '', Validators.required],
          motherIncome: [existingPatientParentData.patientHighSchoolYear || '' ,Validators.required],
          motherStatusId: [existingPatientParentData.patientHighSchoolAddress || '', Validators.required],
        });
      }
      submitPatientParentForm(patientParentForm: FormGroup): void {
        if (patientParentForm.valid) {
          console.log(patientParentForm.value);
          const patientParentFormData = patientParentForm.value;
          console.log('Submitting patient school form:', patientParentFormData);
          this.applicationdashboardService.postPatientSchoolData(patientParentFormData).subscribe({
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
