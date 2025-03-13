import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class SiblingsFormService {
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
      siblingAge: [siblingData.siblingAge || '', Validators.required],
      siblingSexId: [siblingData.siblingSexId || '', Validators.required],
      siblingCivilStatusId: [siblingData.siblingCivilStatusId || '', Validators.required],
      siblingOccupation: [siblingData.siblingOccupation || '', Validators.required],
      siblingEducationAttainment: [siblingData.siblingEducationAttainment || '', Validators.required],
      siblingCode: [siblingData.siblingCode || '']
    });
  }


  submitPatientSiblingForm(siblingFormData: any): Observable<any> {
    const formattedData = {
      listPatientSiblingDatum: siblingFormData.siblings.map((sibling: any) => ({
        recNo: 0,
        patientCode: siblingFormData.patientCode,
        siblingName: sibling.siblingName,
        siblingAge: sibling.siblingAge,
        siblingSexId: sibling.siblingSexId,
        siblingCivilStatusId: sibling.siblingCivilStatusId,
        siblingOccupation: sibling.siblingOccupation,
        siblingEducationAttainment: sibling.siblingEducationAttainment,
        siblingCode: sibling.siblingCode === '' ? '' : sibling.siblingCode
      }))
    };
    return this.applicationdashboardService.postPatientSiblingData(formattedData);
  }
}
