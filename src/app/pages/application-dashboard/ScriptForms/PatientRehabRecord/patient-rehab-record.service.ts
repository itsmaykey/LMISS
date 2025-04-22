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
      return new Observable(); // Prevent multiple submissions
    }

    this.isSubmitting = true; // Disable further submissions

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
          });

          this.isSubmitting = false; // Re-enable submission on success
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to submit patient Rehabilitation data. Please try again.'
          });

          this.isSubmitting = false; // Re-enable submission on error
          observer.error(error);
        }
      });
    });
  }
}
