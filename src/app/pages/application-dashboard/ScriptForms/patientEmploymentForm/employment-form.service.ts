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
      patientEperiodDate: [EmployeeData.patientEperiodDate || '', Validators.required],
      patientNameofCompany: [EmployeeData.patientNameofCompany || '', Validators.required],
      patientCompanyAddress: [EmployeeData.patientCompanyAddress || '', Validators.required],
      patientCompanyPosition: [EmployeeData.patientCompanyPosition || '', Validators.required],
      patientReasonforLeaving: [EmployeeData.patientReasonforLeaving || '', Validators.required],
      employmentCode: [EmployeeData.employmentCode || '']
    });
  }


  submitPatientEmployeeForm(employeeFormData: any): Observable<any> {
    if (this.isSubmitting) {
      console.warn("Submission in progress, preventing duplicate requests.");
      return new Observable((observer) => {
        observer.error("Submission already in progress.");
      });
    }
  
    // ✅ Check if no records were added
    if (!employeeFormData.employs || employeeFormData.employs.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Records',
        text: 'Please add at least one employment record before submitting.',
        confirmButtonText: 'OK'
      });
      return new Observable(); // Prevent submission
    }
  
    this.isSubmitting = true; // Disable further submissions
  
    const formattedData = {
      listPatientEmploymentData: employeeFormData.employs.map((employ: any) => ({
        recNo: 0,
        patientCode: employeeFormData.patientCode,
        patientEperiodDate: employ.patientEperiodDate,
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
          }).then(() => {
            this.isSubmitting = false;
            employeeFormData.employs = []; // ✅ Clear form data on success
          });
  
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to submit patient employment data. Please try again.'
          }).then(() => {
            this.isSubmitting = false;
          });
  
          observer.error(error);
        }
      });
    });
  }
  
}
