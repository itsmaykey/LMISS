
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
        }); // Prevent multiple submissions
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
        this.isSubmitting = true; // Prevent multiple requests

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
                    this.isSubmitting = false; // Reset flag after alert
                });

                observer.next(response);
                observer.complete();
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while submitting patient drug history data.'
                }).then(() => {
                    this.isSubmitting = false; // Reset flag after alert
                });

                observer.error(error);
            }
        });
    });
}

}
