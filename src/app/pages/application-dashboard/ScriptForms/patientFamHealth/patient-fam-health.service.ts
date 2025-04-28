import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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
      famHealths: this.fb.array(
        existingFamHealthHistoryData.famHealths
          ? existingFamHealthHistoryData.famHealths.map((famHealth: any) => this.createFamHealthFormGroup(famHealth, false))
          : [this.createFamHealthFormGroup({}, true)]
      )
    });
  }

  createFamHealthFormGroup(famHealthData: any = {}, isNew: boolean = true): FormGroup {
    return this.fb.group({
      familyName: [famHealthData.familyName || '', Validators.required],
      familyBloodPressure: [famHealthData.familyBloodPressure || '', Validators.required],
      familyHeight: [famHealthData.familyHeight || '', Validators.required],
      familyWeight: [famHealthData.familyWeight || '', Validators.required],
      familyRr: [famHealthData.familyRr || '', Validators.required],
      familyCr: [famHealthData.familyCr || '', Validators.required],
      familyTattooMarks: [famHealthData.familyTattooMarks || '', Validators.required],
      isNew: [isNew] // ✅ mark if it's a new row
    });
  }

  submitPatientFamHealthForm(famHealthFormData: any): Observable<any> {
    if (this.isSubmitting) {
      console.warn("Submission in progress, preventing duplicate requests.");
      return new Observable((observer) => {
        observer.error("Submission already in progress.");
      });
    }

    const hasNewRecords = famHealthFormData.famHealths?.some((famHealth: any) => famHealth.isNew);

    if (!famHealthFormData.famHealths || famHealthFormData.famHealths.length === 0 || !hasNewRecords) {
      Swal.fire({
        icon: 'warning',
        title: 'No Records',
        text: 'Please add at least one new family health record before submitting.',
        confirmButtonText: 'OK'
      });
      return new Observable((observer) => {
        observer.error("No new family health records added.");
      });
    }

    const formattedData = {
      patientFamilyHistory: famHealthFormData.famHealths
        .filter((famHealth: any) => famHealth.isNew) // ✅ only submit new ones
        .map((famHealth: any) => ({
          recNo: 0,
          patientCode: famHealthFormData.patientCode,
          familyName: famHealth.familyName,
          familyBloodPressure: famHealth.familyBloodPressure,
          familyHeight: famHealth.familyHeight,
          familyWeight: famHealth.familyWeight,
          familyRr: famHealth.familyRr,
          familyCr: famHealth.familyCr,
          familyTattooMarks: famHealth.familyTattooMarks
        }))
    };

    console.log('Formatted data being sent:', formattedData);

    return new Observable((observer) => {
      this.isSubmitting = true;

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
          }).then(() => {
            this.isSubmitting = false;
            famHealthFormData.famHealths = [];
          });

          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to submit Patient Family History data. Please try again.'
          }).then(() => {
            this.isSubmitting = false;
          });

          observer.error(error);
        }
      });
    });
  }
}
