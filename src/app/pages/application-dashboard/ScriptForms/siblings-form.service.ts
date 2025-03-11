import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationDashboardService } from '../service/application-dashboard.service';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SiblingsFormService {


   existed: any;
   constructor(
       private fb: FormBuilder,
       private applicationdashboardService: ApplicationDashboardService,
       private route: ActivatedRoute,) {}


   ngOninit(): void {
   }
   createPatientSiblingForm(patientCode: string, existingSiblingData: any = {}): FormGroup {
    return this.fb.group({
      patientCode: [patientCode, Validators.required],
      siblings: this.fb.array(existingSiblingData.siblings ? existingSiblingData.siblings.map((sibling: any) => this.createSiblingFormGroup(sibling)) : [this.createSiblingFormGroup()])
    });
  }

  createSiblingFormGroup(siblingData: any = {}): FormGroup {
    return this.fb.group({
      siblingName: [siblingData.siblingName || '', Validators.required],
      siblingAge: [siblingData.siblingAge || '', Validators.required],
      siblingSexId: [siblingData.siblingSexId || '', Validators.required],
      siblingCivilStatusId: [siblingData.siblingCivilStatusId || '', Validators.required],
      siblingOccupation: [siblingData.siblingOccupation || '', Validators.required],
      siblingEducationAttainment: [siblingData.siblingEducationAttainment || '', Validators.required]
    });
  }

  getExistedPatientSiblingData(patientCode: string): Observable<any> {
    return this.applicationdashboardService.getExistedPatientSiblingData(patientCode);
  }

  submitPatientSiblingForm(siblingFormData: any): Observable<any> {
    return this.applicationdashboardService.postPatientSiblingData(siblingFormData);
  }
}
    //  this.route.paramMap.subscribe((params) => {
    //    const patientCode = params.get('patientCode');
    //    if (patientCode) {
    //      this.existed = this.applicationdashboardService.getExistedPatientSiblingData(patientCode);
    //      console.log('ExistedPatient:', this.existed);
    //    }
    //  });

    //    }
    //    createPatientSiblingForm(ExistedPatientCode: string, existingPatientSiblingData: any = {}): FormGroup {

    //      return this.fb.group({
    //        patientCode : [ ExistedPatientCode, Validators.required],

    //        siblingName: [existingPatientSiblingData.siblingName || '', Validators.required],
    //        siblingAge: [existingPatientSiblingData.siblingAge || '', Validators.required],
    //        siblingSexId: [existingPatientSiblingData.siblingSexId || '', Validators.required],
    //        siblingCivilStatusId: [existingPatientSiblingData.siblingCivilStatusId || '', Validators.required],
    //        siblingOccupation: [existingPatientSiblingData.siblingOccupation || '' ,Validators.required],
    //        siblingEducationAttainment: [existingPatientSiblingData.siblingEducationAttainment || '', Validators.required],



    //      });
    //    }
    //    submitPatientSiblingForm(patientSiblingForm: FormGroup): void {
    //      if (patientSiblingForm.valid) {
    //        const patientSiblingFormData = patientSiblingForm.value;
    //        console.log('Submitting patient school form:', patientSiblingFormData);
    //        this.applicationdashboardService.getExistedPatientSiblingData(patientSiblingFormData).subscribe({
    //          next: (response) => {
    //            console.log('Siblings Data Saved successfully:', response);
    //            alert('Siblings Data Saved successfully');
    //          },
    //          error: (err) => {
    //            console.error('API Error:', err);

    //            if (err.status === 400) {
    //              alert('Validation failed. Please check your inputs.');
    //            } else if (err.status === 401) {
    //              alert('Unauthorized. Please check your permissions.');
    //            } else if (err.status === 500) {
    //              alert('Server error. Please try again later.');
    //            } else {
    //              alert('Failed to register user. Please try again.');
    //            }
    //          },
    //        });
    //      } else {
    //        console.warn('Form submission attempted with invalid data:', patientSiblingForm.value);
    //        alert('Please fill in all required fields correctly.');
    //      }
    //    }

