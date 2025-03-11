import { ActivatedRoute, Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class PatientSpouseFormService {


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
         if (patientSpouseForm.valid) {
           const patientSpouseFormData = patientSpouseForm.value;
           console.log('Submitting patient school form:', patientSpouseFormData);
           this.applicationdashboardService.postPatientSpouseData(patientSpouseFormData).subscribe({
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
           console.warn('Form submission attempted with invalid data:', patientSpouseForm.value);
           alert('Please fill in all required fields correctly.');
         }
       }
}
