
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ChildrensFormService {
  isSubmitting: boolean = false; 
  constructor(
    private fb: FormBuilder,
    private applicationdashboardService: ApplicationDashboardService
  ) {}

  createPatientChildrenForm(ExistedPatientCode: string, existingChildrenData: any = {}): FormGroup {
    return this.fb.group({
      patientCode: [ExistedPatientCode, Validators.required],
      childrens: this.fb.array(
        existingChildrenData.childrens ? existingChildrenData.childrens.map((children: any) => this.createChildrenFormGroup(children)) : [this.createChildrenFormGroup()]
      )
    });
  }

  createChildrenFormGroup(childrenData: any = {}): FormGroup {
    return this.fb.group({
      childName: [childrenData.childName || '', Validators.required],
      childBirthDate: [childrenData.childBirthDate || '', Validators.required],
      childSexId: [childrenData.childSexId || '', Validators.required],
      childCivilStatusId: [childrenData.childCivilStatusId || '', Validators.required],
      childOccupation: [childrenData.childOccupation || '', Validators.required],
      childEducationAttainment: [childrenData.childEducationAttainment || '', Validators.required],
      childrenCode: [childrenData.childrenCode || '']
    });
  }


  submitPatientChildrenForm(childrenFormData: any): Observable<any> {
    if (this.isSubmitting) {
        console.warn("Submission in progress, preventing duplicate requests.");
        return new Observable((observer) => {
            observer.error("Submission already in progress.");
        }); // Prevent multiple submissions
    }

    const formattedData = {
        patientChildrenDatum: childrenFormData.childrens.map((children: any) => ({
            recNo: 0,
            patientCode: childrenFormData.patientCode,
            childName: children.childName,
            childBirthDate: children.childBirthDate,
            childSexId: children.childSexId,
            childCivilStatusId: children.childCivilStatusId,
            childOccupation: children.childOccupation,
            childEducationAttainment: children.childEducationAttainment,
            childrenCode: children.childrenCode === '' ? '' : children.childrenCode
        }))
    };

    return new Observable((observer) => {
        this.isSubmitting = true; // Prevent multiple requests

        this.applicationdashboardService.postPatientChildrenData(formattedData).subscribe({
            next: (response) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Patient children data has been successfully submitted!',
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    this.isSubmitting = false; // Reset flag after alert
                });

                observer.next(response);
                observer.complete();
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while submitting patient children data.'
                }).then(() => {
                    this.isSubmitting = false; // Reset flag after alert
                });

                observer.error(error);
            }
        });
    });
}

}
