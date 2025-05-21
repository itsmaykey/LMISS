import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PatientRehabRecordService {

isSubmitting: boolean = false; 
patientRehabRecordForm!: FormGroup;
originalRehabRecords: any[] = []; // Declare the property to store original rehab records

  constructor(
    private fb: FormBuilder,
    private applicationdashboardService: ApplicationDashboardService
  ) {}
  
 
  createPatientRehabRecordForm(ExistedPatientCode: string, existingRehabRecordData: any = {}): FormGroup {
    return this.fb.group({
      patientCode: [ExistedPatientCode, Validators.required],
      rehabRecords: this.fb.array(
        existingRehabRecordData.rehabRecords ? existingRehabRecordData.rehabRecords.map((rehabRecord: any) => this.createRehabRecordFormGroup(rehabRecord)) : [this.createRehabRecordFormGroup()]
      )
    });
  }
  createRehabRecordFormGroup(RehabRecordData: any = {}): FormGroup {
    return this.fb.group({
      rehabilitationPeriod: [RehabRecordData.rehabilitationPeriod || '', Validators.required],
      rehabilitationCenter: [RehabRecordData.rehabilitationCenter || '', Validators.required],
      patientReason: [RehabRecordData.patientReason || '', Validators.required],
      prevCode: [RehabRecordData.prevCode || '']
    });
  }


  submitPatientRehabRecordForm(rehabRecordFormData: any): Observable<any> {
    if (this.isSubmitting) {
      console.warn("Submission in progress, preventing duplicate requests.");
      return new Observable((observer) => {
        observer.error("Submission already in progress.");
      });
    }
  
    if (!rehabRecordFormData.rehabRecords || rehabRecordFormData.rehabRecords.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Records',
        text: 'Please add at least one rehabilitation record before submitting.',
        confirmButtonText: 'OK'
      });
      return new Observable(); // Prevent submission
    }
  
    // ✅ Check if records are unchanged (compare to original records)
    if (JSON.stringify(rehabRecordFormData.rehabRecords) === JSON.stringify(this.originalRehabRecords)) {
      Swal.fire({
        icon: 'warning',
        title: 'No Changes Detected',
        text: 'No modifications have been made to the rehabilitation records.',
        confirmButtonText: 'OK'
      });
      return new Observable(); // Prevent submission
    }
  
    this.isSubmitting = true;
  
    const formattedData = {
      previousRehabilitationDatums: rehabRecordFormData.rehabRecords.map((rehabRecord: any) => ({
        recNo: 0,
        patientCode: rehabRecordFormData.patientCode,
        rehabilitationPeriod: rehabRecord.rehabilitationPeriod,
        rehabilitationCenter: rehabRecord.rehabilitationCenter,
        patientReason: rehabRecord.patientReason,
        prevCode: rehabRecord.prevCode === '' ? '' : rehabRecord.prevCode
      }))
    };
  
    return new Observable((observer) => {
      this.applicationdashboardService.postPatientRehabilitationData(formattedData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Patient Rehabilitation data submitted successfully!',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then(() => {
            this.isSubmitting = false;
            rehabRecordFormData.rehabRecords = []; // ✅ Clear form on success
          });
  
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to submit patient Rehabilitation data. Please try again.'
          }).then(() => {
            this.isSubmitting = false;
          });
  
          observer.error(error);
        }
      });
    });
  }
  
}
