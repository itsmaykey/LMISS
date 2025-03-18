import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class EmploymentFormService {
  constructor(
    private fb: FormBuilder,
    private applicationdashboardService: ApplicationDashboardService
  ) {}
  createPatientEmployeeForm(ExistedPatientCode: string, existingEmployeeData: any = {}): FormGroup {
    return this.fb.group({
      patientCode: [ExistedPatientCode, Validators.required],
      employs: this.fb.array(
        existingEmployeeData.employs ? existingEmployeeData.employs.map((employ: any) => this.createEmployeeFormGroup(employ)) : [this.createEmployeeFormGroup()]
      )
    });
  }
  createEmployeeFormGroup(EmployeeData: any = {}): FormGroup {
    return this.fb.group({
      patientEPeriodDate: [EmployeeData.patientEPeriodDate || '', Validators.required],
      patientNameofCompany: [EmployeeData.patientNameofCompany || '', Validators.required],
      patientCompanyAddress: [EmployeeData.patientCompanyAddress || '', Validators.required],
      patientCompanyPosition: [EmployeeData.patientCompanyPosition || '', Validators.required],
      patientReasonforLeaving: [EmployeeData.patientReasonforLeaving || '', Validators.required],
      employmentCode: [EmployeeData.employmentCode || '']
    });
  }


  submitPatientEmployeeForm(employeeFormData: any): Observable<any> {
    const formattedData = {
      listPatientEmploymentData: employeeFormData.employs.map((employ: any) => ({
        recNo: 0,
        patientCode: employeeFormData.patientCode,
        patientEPeriodDate: employ.patientEPeriodDate,
        patientNameofCompany: employ.patientNameofCompany,
        patientCompanyAddress: employ.patientCompanyAddress,
        patientCompanyPosition: employ.patientCompanyPosition,
        patientReasonforLeaving: employ.patientReasonforLeaving,
        employmentCode: employ.employmentCode === '' ? '' : employ.employmentCode
      }))
    };
    return this.applicationdashboardService.postPatientEmploymentData(formattedData);
  }
}
