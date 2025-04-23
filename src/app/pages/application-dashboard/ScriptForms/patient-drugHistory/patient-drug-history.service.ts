
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PatientDrugHistoryService {
  isSubmitting: boolean = false; 
  constructor(
    private fb: FormBuilder,
    private applicationdashboardService: ApplicationDashboardService
  ) {}

  createPatientDrugHistoryForm(ExistedPatientCode: string, existingDrugHistoryData: any = {}): FormGroup {
    return this.fb.group({
      patientCode: [ExistedPatientCode, Validators.required],
      drugHistorys: this.fb.array(
        existingDrugHistoryData.drugHistorys && Array.isArray(existingDrugHistoryData.drugHistorys)
          ? existingDrugHistoryData.drugHistorys.map((drugHistory: any) => this.createDrugHistoryFormGroup(drugHistory))
          : []
      )
    });
  }

  createDrugHistoryFormGroup(drugHistoryData: any = {}): FormGroup {
    return this.fb.group({
      drugSubstanceId: [drugHistoryData.drugSubstanceId || '', Validators.required],
      dateStarted: [drugHistoryData.dateStarted || '', Validators.required],
      latestUse: [drugHistoryData.latestUse || '', Validators.required],
      dosageTaken: [drugHistoryData.dosageTaken || '', Validators.required],
      highestDosageTaken: [drugHistoryData.highestDosageTaken || '', Validators.required],
      patientDHCode: [drugHistoryData.patientDHCode || '']
    });
  }


  submitPatientDrugHistoryForm(drugHistoryData: any): Observable<any> {
    if (this.isSubmitting) {
      console.warn("Submission in progress, preventing duplicate requests.");
      return new Observable((observer) => {
        observer.error("Submission already in progress.");
      });
    }
  
    // ✅ Check if no records were added
    if (!drugHistoryData.drugHistorys || drugHistoryData.drugHistorys.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Records',
        text: 'Please add at least one drug history record before submitting.',
        confirmButtonText: 'OK'
      });
      return new Observable(); // Prevent submission
    }
  
    const formattedData = {
      patientDrugHistories: drugHistoryData.drugHistorys.map((drugHistory: any) => ({
        recNo: 0,
        patientCode: drugHistoryData.patientCode,
        drugSubstanceId: drugHistory.drugSubstanceId,
        dateStarted: drugHistory.dateStarted,
        latestUse: drugHistory.latestUse,
        dosageTaken: drugHistory.dosageTaken,
        highestDosageTaken: drugHistory.highestDosageTaken,
        patientDHCode: drugHistory.patientDHCode === '' ? '' : drugHistory.patientDHCode
      }))
    };
  
    return new Observable((observer) => {
      this.isSubmitting = true;
  
      this.applicationdashboardService.postPatientDrugHistoryData(formattedData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Patient drug history data has been successfully submitted!',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then(() => {
            this.isSubmitting = false;
            drugHistoryData.drugHistorys = []; // ✅ Clear form data on success
          });
  
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to submit patient drug history data. Please try again.'
          }).then(() => {
            this.isSubmitting = false;
          });
  
          observer.error(error);
        }
      });
    });
  }
  

}
