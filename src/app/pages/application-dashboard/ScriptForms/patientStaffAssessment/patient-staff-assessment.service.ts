import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApplicationDashboardService } from '../../service/application-dashboard.service';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class PatientStaffAssessmentService {

  
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
        this.applicationdashboardService.getExistedPatientAssessmentData(patientCode).subscribe({
          next: (data) => {
            this.existed = data;
            console.log('Existed Patient:', this.existed);

            // Now initialize the form using the fetched data
            if (this.existed) {
              this.createStaffAssessmentForm(this.existed.patientCode, this.existed);
            }
          },
          error: (err) => console.error('Error fetching patient data:', err)
        });
      }
    });
  }

 
  createStaffAssessmentForm(ExistedPatientCode: string, existingStaffAssessmenttData: any = {}): FormGroup {
    const rawCode = existingStaffAssessmenttData.admissionCode;
    const codesArray = Array.isArray(rawCode)
      ? rawCode
      : rawCode
        ? [rawCode]
        : [];
  
    return this.fb.group({
      patientCode: [ExistedPatientCode, Validators.required],
      admissionCode: this.fb.array(
        codesArray.map(code => this.fb.control(code))
      ),
   
    });
  }
  
  

  submitAssessmentForm(AssessmentForm: FormGroup): void {
    if (this.isSubmitting) {
      console.warn("Submission in progress, preventing duplicate requests.");
      return;
    }
  
    if (AssessmentForm.valid) {
      this.isSubmitting = true;
  
      const selectedAdmission = (AssessmentForm.get('admissionCode') as FormArray).value;
      const patientCode = AssessmentForm.get('patientCode')?.value;
  
      // Get current date in YYYY-MM-DD format
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const admissionDate = `${yyyy}-${mm}-${dd}`;
  
      const formData = {
        listAdmissionData: selectedAdmission.map((code: string) => ({
          recNo: 0,
          patientCode: patientCode,
          admissionCode: code,
          admissionDate: admissionDate
        }))
      };
  
      console.log('Final Data to Submit:', formData);
  
      this.applicationdashboardService.postPatientAssessmentData(formData).subscribe({
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
      console.warn('Invalid form submission:', AssessmentForm.value);
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill in all required fields correctly.',
      });
    }
  }
  

}
