import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PatientDrugEffectService {
  
  isSubmitting: boolean = false;
  existed: any;
  
  constructor(
    private fb: FormBuilder,
    private applicationdashboardService: ApplicationDashboardService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void { 
    this.route.paramMap.subscribe((params) => {
      const patientCode = params.get('patientCode');
      if (patientCode) {
        this.applicationdashboardService.getExistedPatientDrugEffectData(patientCode).subscribe({
          next: (data) => {
            this.existed = data;
            console.log('Existed Patient:', this.existed);
          },
          error: (err) => console.error('Error fetching patient data:', err)
        });
      }
    });
  }

  createPatientDrugEffectForm(ExistedPatientCode: string, existingPatientDrugEffectData: any = {}): FormGroup {
    return this.fb.group({
      patientCode: [ExistedPatientCode, Validators.required],
      drugEffectCode: this.fb.array(
        existingPatientDrugEffectData.drugEffectCode 
          ? existingPatientDrugEffectData.drugEffectCode.map((code: string) => new FormControl(code)) 
          : []  
      ),
    });
  }

  submitPatientDrugEffectForm(patientDrugEffectForm: FormGroup): void {
    if (this.isSubmitting) {
      console.warn("Submission in progress, preventing duplicate requests.");
      return;
    }

    if (patientDrugEffectForm.valid) {
      this.isSubmitting = true;

      const selectedEffects = (patientDrugEffectForm.get('drugEffectCode') as FormArray).value;
      const formData = {
        patientCode: patientDrugEffectForm.get('patientCode')?.value,
        drugEffectCode: selectedEffects, 
      };

      console.log(' Final Data to Submit:', formData);

      this.applicationdashboardService.postPatientDrugEffectData(formData).subscribe({
        next: (response) => {
          console.log('Effects Data Saved successfully:', response);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Effects Data Saved successfully.',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then(() => {
            this.isSubmitting = false;
          });
        },
        error: (err) => {
          console.error('API Error:', err);
          let errorMessage = "Failed to save data. Please try again.";
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
          }).then(() => {
            this.isSubmitting = false;
          });
        }
      });
    } else {
      console.warn('Invalid form submission:', patientDrugEffectForm.value);
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill in all required fields correctly.',
      });
    }
  }
}
