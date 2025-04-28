import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PatientDrugEffectService {
  rawDrugEffectCodes: string[] = [];  // Add this at top of your component

  isSubmitting: boolean = false;
  existed: any;
  drugEffects: any[] = [];
allPreviouslySelectedCodes: string[] = [];

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

            if (this.existed) {
              this.createPatientDrugEffectForm(this.existed.patientCode, this.existed);
            }
          },
          error: (err) => console.error('Error fetching patient data:', err)
        });
      }
    });
  }

 
  createPatientDrugEffectForm(ExistedPatientCode: string, existingPatientDrugEffectData: any = {}): FormGroup {
    const rawCode = existingPatientDrugEffectData.drugEffectCode;
    const codesArray = Array.isArray(rawCode)
      ? rawCode
      : rawCode
        ? [rawCode]
        : [];
  
    console.log('Raw Code:', rawCode);
  
    this.rawDrugEffectCodes = codesArray;
  
    return this.fb.group({
      patientCode: [ExistedPatientCode, Validators.required],
      drugEffectCode: this.fb.array(
        codesArray.map(code => this.fb.control(code))
      ),
      drugOtherEffects: [existingPatientDrugEffectData.drugOtherEffects || '']
    });
  }
  
  
  
  resetForm() {
    this.allPreviouslySelectedCodes = [];
  }
  
  submitPatientDrugEffectForm(patientDrugEffectForm: FormGroup): void {
    if (this.isSubmitting) {
      console.warn("Submission in progress, preventing duplicate requests.");
      return;
    }
  
    if (patientDrugEffectForm.valid) {
      this.isSubmitting = true;
  
      const selectedCodes = (patientDrugEffectForm.get('drugEffectCode') as FormArray).value || [];
      console.log('Selected Codes on Submit:', selectedCodes);
  
      const rawCode = this.rawDrugEffectCodes; 
  
      const missingCodes = rawCode.filter((code: string) => !selectedCodes.includes(code));
  
      const selectedDetails = selectedCodes.map((code: string) => ({
        recNo: 0,
        patientCode: patientDrugEffectForm.get('patientCode')?.value,
        drugEffectCode: code,
        drugOtherEffects: patientDrugEffectForm.get('drugOtherEffects')?.value,
        drugEffectStatus: 1 
      }));
  
      const deselectedDetails = missingCodes.map((code: string) => ({
        recNo: 0,
        patientCode: patientDrugEffectForm.get('patientCode')?.value,
        drugEffectCode: code,
        drugOtherEffects: patientDrugEffectForm.get('drugOtherEffects')?.value,
        drugEffectStatus: 0  
      }));
  
      const formData = {
        drugEffectDatum: [...selectedDetails, ...deselectedDetails]  
      };
  
  
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
  
            this.allPreviouslySelectedCodes = [...selectedCodes];
          });
        },
        error: (err) => {
          console.error('API Error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Failed to save data. Please try again.",
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
