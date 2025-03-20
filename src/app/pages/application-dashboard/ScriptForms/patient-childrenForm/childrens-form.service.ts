
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ChildrensFormService {
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
      this.applicationdashboardService.postPatientChildrenData(formattedData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Patient children data has been successfully submitted!'
          });
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while submitting patient children data.'
          });
          observer.error(error);
        }
      });
    });
  }
}
