import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PatientDashboardService } from './service/patient-dashboard.service';
// Update the import path below if the actual path is different
import { AuthService } from '../../Admin/Auth/AuthService';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { SocialWorkerNotesService } from './ScriptForms/SocialWorkerNotes/social-worker-notes.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Modal, Offcanvas } from 'bootstrap';

pdfMake.vfs = pdfFonts.vfs;

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})

export class PatientDashboardComponent  implements OnInit {
  [x: string]: any;
  @ViewChild('offcanvasRef') offcanvasElementRef!: ElementRef;
  modalInstance: Modal | null = null;
  ExistedPatientCode = '';
  ExistedPatient: any = [];
  ExistedAssessmentCode = '';
  userInfo: any; // <-- Declare userInfo property
  SocialWorkerNotesForm!: FormGroup; 
  MentalStatusForm!: FormGroup;
  isSubmitting = false;
  fb: FormBuilder;
  viewNotesModalInstance: any;
  backDropModalInstance: any;
  bacDropMPPRReport: any;
  viewNotesModal: any;
  viewPMMRModal: any;
  swpnData: any;
  swpnDataEdit: any;
  isLoading: boolean | undefined;
  swpnFormArray: any = [];
  isEditingTbleView = true;
   isEditing : any;
 isEditingMPPRView = true;
    Appearance: any = [];
  Sensorium: any = [];
  Functioning: any = [];
  Speech: any = [];
  Behavior: any = [];
  MoodAffect: any = [];
  DailyPattern: any = [];
  ThoughtContent: any = [];
  PhysicIndicators: any = [];
  Denial: any = [];
  WithdSymptoms: any = [];
  SuspenActivities: any = [];
  Cravings: any = [];
    selectedAppearance: { AppearanceId: string }[] = []
  onEditNotes() {
    this.isEditing = true;
     this.isEditingTbleView = false;
  }
  onSaveNotes(){
     this.isEditing = false;
     this.isEditingTbleView = true;
  }

  onSaveMPRR(){
     this.isEditingMPPRView = true;
  }
  constructor(private router: Router,http: HttpClient,
     private route: ActivatedRoute,
     private service: PatientDashboardService,
     private authService: AuthService, 
     fb: FormBuilder,
     private SocialWorkerNotesService: SocialWorkerNotesService,
     
  ) {
    this.fb = fb;
    
  }
  
  viewNotes(recNo: string): void {
  const patientCode = this.route.snapshot.paramMap.get('patientCode');
  const assessmentCode = this.route.snapshot.paramMap.get('assessmentCode');

  if (patientCode && assessmentCode) {
    this.service.getPatientProgressReport(patientCode, assessmentCode).subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length > 0) {
          this.swpnDataEdit = response[0];
        }

        if (this.swpnDataEdit && this.swpnDataEdit.entity && !Array.isArray(this.swpnDataEdit.entity)) {
          this.swpnDataEdit.entity = Object.values(this.swpnDataEdit.entity);
        }

        if (recNo && this.swpnDataEdit?.entity) {
          this.swpnDataEdit.entity = this.swpnDataEdit.entity.filter((item: any) => item.recNo == recNo);
        }

        const modalElement = document.getElementById('viewNotesModal');
        if (!modalElement) {
        console.error('Modal element not found in DOM');
        return;
      }

      this.viewNotesModal = new Modal(modalElement);
      this.viewNotesModal.show();

        console.log('Filtered entity for recNo:', this.swpnData.entity);
      },
      error: (error) => {
        console.error('Error fetching patient progress report:', error);
      }
    });
  } else {
    console.error('Missing patientCode or assessmentCode in route parameters.');
  }
}

showModal(): void {
  const modalElement = document.getElementById('backDropModal');
  if (!modalElement) {
    console.error('Modal element not found in DOM');
    return;
  }

  this.backDropModalInstance = new Modal(modalElement);
  this.backDropModalInstance.show();
}
showModalMPPR(): void {
  const modalElement = document.getElementById('viewPMMRModal');
  if (!modalElement) {
    console.error('Modal element not found in DOM');
    return;
  }

  this.bacDropMPPRReport = new Modal(modalElement);
  this.bacDropMPPRReport.show();
}
  hideModal(): void {
    this.backDropModalInstance?.hide();
  }
  backToApp(): void {
  if (!this.router) {
    console.error('Router is undefined!');
    return;
  }

  this.isLoading = true;

  setTimeout(() => {
    this.isLoading = false;
  }, 3000);

  const sub = this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      sub.unsubscribe(); 

      setTimeout(() => {
        this.showTab('#ApplicationHisto');
      }, 100); 
    }
  });

  this.router.navigate(['/application', this.ExistedPatientCode]);
}

 private showTab(selector: string): void {
  const tabElement = document.querySelector(`[data-bs-target="${selector}"]`);
  if (tabElement) {
    const tabInstance = new (window as any).bootstrap.Tab(tabElement);
    tabInstance.show();
  } else {
    console.warn(`Tab element not found for selector: ${selector}`);
  }
}

  ngOnInit(): void {
     this.fetchAdditionalData();
    this.getExisted();
     this.userInfo = this.authService.getUserInfo();
    console.log('Staff ID No:', this.userInfo.id);

   
    const assessmentCode = this.route.snapshot.paramMap.get('assessmentCode');
    const patientCode = this.route.snapshot.paramMap.get('patientCode') || '';
    this.ExistedPatientCode = patientCode;
    
    this.SocialWorkerNotesForm = this.fb.group({
      recNo: 0,
      patientCode: patientCode,
      interventionCode: assessmentCode,
      staffIdNo: this.userInfo.id,
      patientActivies: ['', Validators.required],
      patientIntervention: ['', Validators.required],
      interventionDate: ['', Validators.required]
    });
    this.MentalStatusForm = this.fb.group({
      AppearanceId: this.fb.array([]) // <-- FormArray for checkboxes
    });
    this.service.getrefAppearance().subscribe({
      next: (response) => {
        this.Appearance = response;
        console.log(this.Appearance);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefSensorium().subscribe({
      next: (response) => {
        this.Sensorium = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefFunctioning().subscribe({
      next: (response) => {
        this.Functioning = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefSpeech().subscribe({
      next: (response) => {
        this.Speech = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefBehavior().subscribe({
      next: (response) => {
        this.Behavior = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefMoodAffect().subscribe({
      next: (response) => {
        this.MoodAffect = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefDailyPatterns().subscribe({
      next: (response) => {
        this.DailyPattern = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefThoughtContent().subscribe({
      next: (response) => {
        this.ThoughtContent = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefPhysicalIndicator().subscribe({
      next: (response) => {
        this.PhysicIndicators = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefDenial().subscribe({
      next: (response) => {
        this.Denial = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefPhysicalWithdrawalSymptoms().subscribe({
      next: (response) => {
        this.WithdSymptoms = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefSuspensionofactivity().subscribe({
      next: (response) => {
        this.SuspenActivities = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefCravings().subscribe({
      next: (response) => {
        this.Cravings = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }
 fetchAdditionalData(): void {
      const patientCode = this.route.snapshot.paramMap.get('patientCode');
      const assessmentCode = this.route.snapshot.paramMap.get('assessmentCode');

if (patientCode && assessmentCode) {
  this.service.getPatientProgressReport(patientCode, assessmentCode).subscribe({
    next: (response) => {
  if (Array.isArray(response) && response.length > 0) {
    this.swpnData = response[0]; 
  }

  if (this.swpnData && this.swpnData.entity && !Array.isArray(this.swpnData.entity)) {
    this.swpnData.entity = Object.values(this.swpnData.entity);
  }

    console.log('Converted entity:', this.swpnData);
  },
    error: (error) => {
      console.error('Error fetching patient progress report:', error);
    }
  });
  
} else {
  console.error('Missing patientCode or interventionCode in route parameters.');
}

    }
getExisted(): void {
  this.route.paramMap.subscribe((params) => {
    const patientCode = params.get('patientCode');
    const assessmentCode = params.get('assessmentCode');
    console.log('assessmentCode Code:', assessmentCode);
    console.log('Patient Code:', patientCode);
    if (patientCode) {
      this.service.getExistedPatientData(patientCode).subscribe({
        next: (response) => {
          this.ExistedPatient = response;
          if (this.ExistedPatient.length > 0) {
            console.log(this.ExistedPatient);
          } else {
           console.log("err")
          }
        },
        error: () => {

        },
      });
    }
  });
}
checkExisted(): void {
    this.route.paramMap.subscribe((params) => {
      const patientCode = params.get('patientCode');
      if (patientCode) {
        this.ExistedPatientCode = patientCode;
        this.loadExistedPatientData(patientCode);
      } else {
        this.initializeForms();
      }
    });
  }
 loadExistedPatientData(patientCode: string): void {
 
    // this.loadExistedPatientFamHealthData(patientCode);
  }
  initializeForms(): void {
   
    // this.SocialWorkerNotesForm = this.SocialWorkerNotesService.createPatientSchoolForm(this.ExistedPatientCode);
   
  }
tryprint(): void{
  console.log(this.ExistedPatient[0].patientCode);
  const docDefinition: TDocumentDefinitions = {
    content: [
      // { text: 'Luntiang Paraiso Regional Rehabilitation Center',
      //    style: 'header',
      //    alignment: 'center',
      //    fontSize: 14,
      //     bold: true,
      //     margin: [0, 20, 0, 8]
      //  },

      {
        table: {
          body: [
            [

              {
                 qr: '\n \n'+ this.ExistedPatient[0].patientCode,
                 // ← this can be any text or URL
                 fit: 80, // optional: size of the QR
               //LEFT TOP  RIGHT BOTTOM
                 margin: [15, 10, 0, 10],
                 border: [true, true, false, true], // remove borders
              },
              {
                text: 'Luntiang Paraiso Regional Rehabilitation Center \n \n'
                + this.ExistedPatient[0].pLastName + ', ' +this.ExistedPatient[0].pFirstName + ' ' + this.ExistedPatient[0].pMiddleName + '\n \n'
                + 'INPATIENT',
                 //LEFT TOP BOTTOM RIGHT
                margin: [0, 10, 0, 10],
                border: [false, true, true, true], // remove borders
              },



            ]
          ],

        },
        margin: [10, 10, 10, 10], // Optional: add margin to the table
        alignment: 'center',
       // Optional: remove borders around the table
      },
      ],
      }


  pdfMake.createPdf(docDefinition).open();

}

// MPPRFormSubmit(): void {
//     this.patientFormService.SocialWorkerNotesFormSubmit(this.SocialWorkerNotesForm);
//   }
SocialWorkerNotesFormSubmit(): void {
  if (this.SocialWorkerNotesForm.invalid) {
    this.SocialWorkerNotesForm.markAllAsTouched(); 
    return;
  }

  this.isSubmitting = true;

  const formData = this.SocialWorkerNotesForm.value;
  console.log(formData);

  this.service.postPatientProgressReport( formData ).subscribe({
    
    next: (response) => {
      console.log('Form saved successfully:', response);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Patient progress report submitted successfully!',
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      this.hideModal();
      this.SocialWorkerNotesForm.reset();
      this.isSubmitting = false;
      this.refreshSwpnData();
    },
    error: (error) => {
      console.error('Error saving form:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit patient progress report. Please try again.',
        showConfirmButton: true,
        allowOutsideClick: true,
        allowEscapeKey: true
      });

      this.isSubmitting = false;
    }
  });
}
refreshSwpnData(): void {
  const patientCode = this.ExistedPatientCode || this.route.snapshot.paramMap.get('patientCode') || '';
 const assessmentCode = this.ExistedAssessmentCode || this.route.snapshot.paramMap.get('assessmentCode') || '';

 if (patientCode && assessmentCode) {
  this.service.getPatientProgressReport(patientCode, assessmentCode).subscribe({
    next: (response) => {
  if (Array.isArray(response) && response.length > 0) {
    this.swpnData = response[0]; 
  }

  if (this.swpnData && this.swpnData.entity && !Array.isArray(this.swpnData.entity)) {
    this.swpnData.entity = Object.values(this.swpnData.entity);
  }

    console.log('Converted entity:', this.swpnData);
  },
    error: (error) => {
      console.error('Error fetching patient progress report:', error);
    }
  });
} else {
  console.error('Missing patientCode or interventionCode in route parameters.');
}
}

 get AppearanceIdArray(): FormArray {
  return this.MentalStatusForm.get('AppearanceId') as FormArray;
}

  onAppearanceCheckboxChange(event: Event, Appearance: any): void {
  const checkbox = event.target as HTMLInputElement;
  const AppearanceIdArray = this.AppearanceIdArray;

  if (checkbox.checked) {
    AppearanceIdArray.push(this.fb.control(Appearance.AppearanceId));
    this.selectedAppearance.push(Appearance); // Add to list
  } else {
    const index = AppearanceIdArray.controls.findIndex(
      control => control.value === Appearance.AppearanceId
    );
    if (index !== -1) {
      AppearanceIdArray.removeAt(index);
    }

    // Remove from selectedAppearance
    this.selectedAppearance = this.selectedAppearance.filter(
      (item) => item.AppearanceId !== Appearance.AppearanceId
    );
  }

}
// AssessmentFormSubmit(): void {
//   if (this.isSubmitting) {
//     return; // Prevent rapid re-submission
//   }
  

//   if (this.MentalStatusForm.valid) {
//     this.isSubmitting = true; // Lock submission

//     const patientCode = this.MentalStatusForm.get('patientCode')?.value;
//     const admissionDate = new Date().toISOString();
    

//     const listAdmissionData = this.selectedAppearance.map((admission, index) => ({
//       recNo: 0, // Ensure it's treated as new
//       patientCode: patientCode,
//       admissionDate: admissionDate,
//       admissionStatus: 0,
//     }));

//     const formData = {
//       recNo: 0, // Set to null to avoid accidental updates
//       patientCode: patientCode,
    
//       admissionStatus: 1,
//       patientAssessmentStatus: 1,
//       staffIdNo: this.userInfo?.id || 0,
//       isActive: true,
//     };

//     this.PatientStaffAssessmentService.postPatientAssessmentData(formData).subscribe({
//       next: () => {
//         console.log('Assessment submitted:', formData);

//         this.PatientStaffAssessmentService.postAdmissionData({ listAdmissionData }).subscribe({
//           next: () => {
//             console.log('Admission list submitted:', listAdmissionData);

//             Swal.fire({
//               icon: 'success',
//               title: 'Success',
//               text: 'Patient Assessment data submitted successfully!',
//               timer: 1000,
//               timerProgressBar: true,
//               showConfirmButton: false,
//               allowOutsideClick: false,
//               allowEscapeKey: false,
//             didClose: () => {
//             this.MentalStatusForm.reset();
//             (this.MentalStatusForm.get('AppearanceId') as FormArray).clear(); 

//               this.selectedAppearance = [];

//               this.Appearance.forEach((type: any) => type.selected = false);

//               this.isSubmitting = false;
//             }
//             });
//           },
//           error: (err: any) => {
//             this.isSubmitting = false;
//             this.handleError(err, 'admission data');
//           }
//         });
//       },
//       error: (err: any) => {
//         this.isSubmitting = false;
//         this.handleError(err, 'assessment form');
//       }
//     });

//   } else {
//     alert('Please fill in all required fields correctly.');
//   }
// }
private handleError(error: any, context: string): void {
  console.error(`Error submitting ${context} data:`, error);

  if (error.status === 400) {
    alert('Validation failed. Please check your inputs.');
  } else if (error.status === 401) {
    alert('Unauthorized. Please check your permissions.');
  } else if (error.status === 500) {
    alert('Server error. Please try again later.');
  } else {
    alert(`Failed to submit ${context} data. Please try again.`);
  }
}
}
