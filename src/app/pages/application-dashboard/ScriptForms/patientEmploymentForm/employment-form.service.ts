import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class EmploymentFormService {
  isSubmitting: boolean = false; 
  patientEmploymentForm!: FormGroup;
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
    if (this.isSubmitting) {
      return new Observable(); // Prevent multiple submissions
    }

    this.isSubmitting = true; // Disable further submissions

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

    return new Observable((observer) => {
      this.applicationdashboardService.postPatientEmploymentData(formattedData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Patient employment data submitted successfully!',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false
          });

          this.isSubmitting = false; // Re-enable submission on success
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to submit patient employment data. Please try again.'
          });

          this.isSubmitting = false; // Re-enable submission on error
          observer.error(error);
        }
      });
    });
  }
}
