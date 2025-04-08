import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class PatientFamHealthService {

  
  isSubmitting: boolean = false; 
  FamHealthHistoryForm!: FormGroup;
    constructor(
      private fb: FormBuilder,
      private applicationdashboardService: ApplicationDashboardService
    ) {}
    
    createPatientFamHealthHistoryForm(ExistedPatientCode: string, existingFamHealthHistoryData: any = {}): FormGroup {
      return this.fb.group({
        patientCode: [ExistedPatientCode, Validators.required],
        FamHealthHistories: this.fb.array(
          existingFamHealthHistoryData.FamHealthHistories && Array.isArray(existingFamHealthHistoryData.FamHealthHistories)
            ? existingFamHealthHistoryData.FamHealthHistories.map((famHealth: any) => this.createFamHealthFormGroup(famHealth))
            : []
        )
      });
    }
    createFamHealthFormGroup(famHealthData: any = {}): FormGroup {
      return this.fb.group({
        familyName: [famHealthData.familyName || '', Validators.required],
        familyBloodPressure: [famHealthData.familyBloodPressure || '', Validators.required],
        familyHeight: [famHealthData.familyHeight || '', Validators.required],
        familyWeight: [famHealthData.familyWeight || '', Validators.required],
        familyRr: [famHealthData.familyRr || '', Validators.required],
        familyCr: [famHealthData.familyCr || '', Validators.required],
        familyTattooMarks: [famHealthData.familyTattooMarks || '', Validators.required]
      });
    }
  
  
    submitPatientFamHealthForm(famHealthFormData: any): Observable<any> {
      if (this.isSubmitting) {
        return new Observable(); // Prevent multiple submissions
      }
  
      this.isSubmitting = true; // Disable further submissions
  
      const formattedData = {
        patientFamilyHistory: famHealthFormData.famHealth.map((famHealth: any) => ({
          recNo: 0,
          patientCode: famHealthFormData.patientCode,
          familyName: famHealthFormData.familyName,
          familyBloodPressure: famHealthFormData.familyBloodPressure,
          familyHeight: famHealthFormData.familyHeight,
          familyWeight: famHealthFormData.familyWeight,
          familyRr: famHealthFormData.familyRr,
          familyCr: famHealthFormData.familyCr,
          familyTattooMarks: famHealthFormData.familyTattooMarks
        }))
      };
  
      return new Observable((observer) => {
        this.applicationdashboardService.postPatientFamilyHistoryData(formattedData).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Patient Family History data submitted successfully!',
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
              text: 'Failed to submit Patient Family History data. Please try again.'
            });
  
            this.isSubmitting = false; // Re-enable submission on error
            observer.error(error);
          }
        });
      });
    }
}
