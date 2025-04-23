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
    // Subscribe to route params to fetch the patient code
    this.route.paramMap.subscribe((params) => {
      const patientCode = params.get('patientCode');
      if (patientCode) {
        this.applicationdashboardService.getExistedPatientDrugEffectData(patientCode).subscribe({
          next: (data) => {
            this.existed = data;
            console.log('Existed Patient:', this.existed);

            // Now initialize the form using the fetched data
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
  
    return this.fb.group({
      patientCode: [ExistedPatientCode, Validators.required],
      drugEffectCode: this.fb.array(
        codesArray.map(code => this.fb.control(code))
      ),
      drugOtherEffects: [existingPatientDrugEffectData.drugOtherEffects || '']
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
      const drugOtherEffects = patientDrugEffectForm.get('drugOtherEffects')?.value;
      const patientCode = patientDrugEffectForm.get('patientCode')?.value;

      const formData = {
        drugEffectDatum: selectedEffects.map((code: string) => ({
          recNo: 0,  // Assuming `recNo` is the primary key or identifier (could be changed)
          patientCode: patientCode,
          drugEffectCode: code,
          drugOtherEffects: drugOtherEffects,
        }))
      };

      console.log('Final Data to Submit:', formData);

      // Send the data to the backend
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
