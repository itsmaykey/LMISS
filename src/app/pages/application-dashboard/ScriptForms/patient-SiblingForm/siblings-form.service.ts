import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SiblingsFormService {
  isSubmitting: boolean = false; 
  constructor(
    private fb: FormBuilder,
    private applicationdashboardService: ApplicationDashboardService
  ) {}

  createPatientSiblingForm(ExistedPatientCode: string, existingSiblingData: any = {}): FormGroup {
    return this.fb.group({
      patientCode: [ExistedPatientCode, Validators.required],
      siblings: this.fb.array(
        existingSiblingData.siblings ? existingSiblingData.siblings.map((sibling: any) => this.createSiblingFormGroup(sibling)) : [this.createSiblingFormGroup()]
      )
    });
  }

  createSiblingFormGroup(siblingData: any = {}): FormGroup {
    return this.fb.group({
      siblingName: [siblingData.siblingName || '', Validators.required],
      siblingBirthDate: [siblingData.siblingBirthDate || '', Validators.required],
      siblingSexId: [siblingData.siblingSexId || '', Validators.required],
      siblingCivilStatusId: [siblingData.siblingCivilStatusId || '', Validators.required],
      siblingOccupation: [siblingData.siblingOccupation || '', Validators.required],
      siblingEducationAttainment: [siblingData.siblingEducationAttainment || '', Validators.required],
      siblingCode: [siblingData.siblingCode || '']
    });
  }


  submitPatientSiblingForm(siblingFormData: any): Observable<any> {
    if (this.isSubmitting) {
      console.warn("Submission in progress, preventing duplicate requests.");
      return new Observable((observer) => {
        observer.error("Submission already in progress.");
      });
    }
  
    if (!siblingFormData.siblings || siblingFormData.siblings.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Records',
        text: 'Please add at least one sibling record before submitting.',
        confirmButtonText: 'OK'
      });
      return new Observable();
    }
  
    const formattedData = {
      listPatientSiblingDatum: siblingFormData.siblings.map((sibling: any) => ({
        recNo: 0,
        patientCode: siblingFormData.patientCode,
        siblingName: sibling.siblingName,
        siblingBirthDate: sibling.siblingBirthDate,
        siblingSexId: sibling.siblingSexId,
        siblingCivilStatusId: sibling.siblingCivilStatusId,
        siblingOccupation: sibling.siblingOccupation,
        siblingEducationAttainment: sibling.siblingEducationAttainment,
        siblingCode: sibling.siblingCode === '' ? '' : sibling.siblingCode
      }))
    };
  
    return new Observable((observer) => {
      this.isSubmitting = true;
  
      this.applicationdashboardService.postPatientSiblingData(formattedData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Sibling data submitted successfully!',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then(() => {
            this.isSubmitting = false;
            siblingFormData.siblings = []; 
          });
  
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to submit Patient Family History data. Please try again.' 
          }).then(() => {
            this.isSubmitting = false;
          });
  
          observer.error(error);
        }
      });
    });
  }
  

}
