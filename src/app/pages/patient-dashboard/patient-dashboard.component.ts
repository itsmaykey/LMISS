import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
    Appearance: any[] = [];
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
  
   listPatientMonthlyPReport: any[] = [];
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
      appearanceId: this.fb.array([]),
      sensoriumId: this.fb.array([]),
      functioningId: this.fb.array([]),
      speechId: this.fb.array([]),
      behaviorId: this.fb.array([]),
      moodAffectId: this.fb.array([]),
      dailyPatternsId: this.fb.array([]),
      thoughtContentId: this.fb.array([])
    });
    this.service.getrefAppearance().subscribe({
      next: (response) => {
        this.Appearance = response as any[];
        console.log(this.Appearance);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefSensorium().subscribe({
      next: (response) => {
        this.Sensorium = response as any[];
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefFunctioning().subscribe({
      next: (response) => {
        this.Functioning = response as any[];
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefSpeech().subscribe({
      next: (response) => {
        this.Speech = response as any[];
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefBehavior().subscribe({
      next: (response) => {
        this.Behavior = response as any[];
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefMoodAffect().subscribe({
      next: (response) => {
        this.MoodAffect = response as any[];
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefDailyPatterns().subscribe({
      next: (response) => {
        this.DailyPattern = response as any[];
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getrefThoughtContent().subscribe({
      next: (response) => {
        this.ThoughtContent = response as any[];
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
    console.log('Assessment Code:', assessmentCode);
    console.log('Patient Code:', patientCode);

    if (patientCode && assessmentCode) {
      this.service.getExistedPatientData(patientCode, assessmentCode).subscribe({
        next: (response: { patientCode?: string; assessmentCode?: string; [key: string]: any }) => {
          console.log('API Response:', response);  // Log the entire response for debugging
          
          // Since the API response is an object, not an array, we directly assign it
          if (response && response.patientCode && response.assessmentCode) {
            this.ExistedPatient = response;
            console.log('Existed Patient Data:', this.ExistedPatient);  // Log the assigned data
          } else {
            console.log("Invalid or missing data in the response.");
            this.ExistedPatient = null;  // Handle invalid or incomplete response
          }
        },
        error: (err) => {
          console.error('Error fetching Existed Patient Data:', err);
        },
      });
    } else {
      console.log("Missing patientCode or assessmentCode in route parameters.");
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
  get appearanceId() {
    return this.MentalStatusForm.get('appearanceId') as FormArray;
  }
  get sensoriumId() {
    return this.MentalStatusForm.get('sensoriumId') as FormArray;
  }
  get functioningId() {
    return this.MentalStatusForm.get('functioningId') as FormArray;
  }
   get speechId() {
    return this.MentalStatusForm.get('speechId') as FormArray;
  }
  get behaviorId() {
    return this.MentalStatusForm.get('behaviorId') as FormArray;
  }
  get moodAffectId() {
    return this.MentalStatusForm.get('moodAffectId') as FormArray;
  }
  get dailyPatternsId() {
    return this.MentalStatusForm.get('dailyPatternsId') as FormArray;
  }
  get thoughtContentId() {
    return this.MentalStatusForm.get('thoughtContentId') as FormArray;
  }
  
   onAppearanceCheckboxChange(event: any, item: any): void {
  const appearanceArray = this.appearanceId;
  const isChecked = event.target.checked;

  if (isChecked) {
    // Avoid duplicates
    if (!appearanceArray.value.includes(item.appearanceId)) {
      appearanceArray.push(this.fb.control(item.appearanceId));
    }
  } else {
    const index = appearanceArray.controls.findIndex(
      control => control.value === item.appearanceId
    );
    if (index !== -1) {
      appearanceArray.removeAt(index);
    }
  }

  this.updateMonthlyReport(); 
}

onSensoriumCheckboxChange(event: any, item: any): void {
  const sensoriumArray = this.sensoriumId;
  const isChecked = event.target.checked;

  if (isChecked) {
    if (!sensoriumArray.value.includes(item.sensoriumId)) {
      sensoriumArray.push(this.fb.control(item.sensoriumId));
    }
  } else {
    const index = sensoriumArray.controls.findIndex(
      control => control.value === item.sensoriumId
    );
    if (index !== -1) {
      sensoriumArray.removeAt(index);
    }
  }

  this.updateMonthlyReport(); 
}
onFunctioningCheckboxChange(event: any, item: any): void {
  const functioningArray = this.functioningId;
  const isChecked = event.target.checked;

  if (isChecked) {
    if (!functioningArray.value.includes(item.functioningId)) {
      functioningArray.push(this.fb.control(item.functioningId));
    }
  } else {
    const index = functioningArray.controls.findIndex(
      control => control.value === item.functioningId
    );
    if (index !== -1) {
      functioningArray.removeAt(index);
    }
  }

  this.updateMonthlyReport(); 
}
onSpeechCheckboxChange(event: any, item: any): void {
  const speechIdArray = this.speechId;
  const isChecked = event.target.checked;

  if (isChecked) {
    if (!speechIdArray.value.includes(item.speechId)) {
      speechIdArray.push(this.fb.control(item.speechId));
    }
  } else {
    const index = speechIdArray.controls.findIndex(
      control => control.value === item.speechId
    );
    if (index !== -1) {
      speechIdArray.removeAt(index);
    }
  }

  this.updateMonthlyReport(); 
}
  onBehaviorCheckboxChange(event: any, item: any): void {
  const behaviorIdArray = this.behaviorId;
  const isChecked = event.target.checked;

  if (isChecked) {
    if (!behaviorIdArray.value.includes(item.behaviorId)) {
      behaviorIdArray.push(this.fb.control(item.behaviorId));
    }
  } else {
    const index = behaviorIdArray.controls.findIndex(
      control => control.value === item.behaviorId
    );
    if (index !== -1) {
      behaviorIdArray.removeAt(index);
    }
  }

  this.updateMonthlyReport(); 
}
  onMoodAffectCheckboxChange(event: any, item: any): void {
  const moodAffectIdArray = this.moodAffectId;
  const isChecked = event.target.checked;

  if (isChecked) {
    if (!moodAffectIdArray.value.includes(item.moodAffectId)) {
      moodAffectIdArray.push(this.fb.control(item.moodAffectId));
    }
  } else {
    const index = moodAffectIdArray.controls.findIndex(
      control => control.value === item.moodAffectId
    );
    if (index !== -1) {
      moodAffectIdArray.removeAt(index);
    }
  }

  this.updateMonthlyReport(); 
}
  onDailyPatternCheckboxChange(event: any, item: any): void {
  const dailyPatternsIdArray = this.dailyPatternsId;
  const isChecked = event.target.checked;

  if (isChecked) {
    if (!dailyPatternsIdArray.value.includes(item.dailyPatternsId)) {
      dailyPatternsIdArray.push(this.fb.control(item.dailyPatternsId));
    }
  } else {
    const index = dailyPatternsIdArray.controls.findIndex(
      control => control.value === item.dailyPatternsId
    );
    if (index !== -1) {
      dailyPatternsIdArray.removeAt(index);
    }
  }

  this.updateMonthlyReport(); 
}

  onThoughtContentCheckboxChange(event: any, item: any): void {
  const thoughtContentIdArray = this.thoughtContentId;
  const isChecked = event.target.checked;

  if (isChecked) {
    if (!thoughtContentIdArray.value.includes(item.thoughtContentId)) {
      thoughtContentIdArray.push(this.fb.control(item.thoughtContentId));
    }
  } else {
    const index = thoughtContentIdArray.controls.findIndex(
      control => control.value === item.thoughtContentId
    );
    if (index !== -1) {
      thoughtContentIdArray.removeAt(index);
    }
  }

  this.updateMonthlyReport(); 
}
  // Method to save data (you can customize this as needed)
  onSaveMental(): void {
    const fullReport = {
      listPatientMonthlyPReport: this.listPatientMonthlyPReport
    };
    console.log('Full Report:', JSON.stringify(fullReport, null, 2));
  }
    updateMonthlyReport(): void {
  const appearanceIds = this.appearanceId.value;
  const sensoriumIds = this.sensoriumId.value;
  const functioningIds = this.functioningId.value;
  const speechIds = this.speechId.value;
  const behaviorIds = this.behaviorId.value;
  const moodAffectIds = this.moodAffectId.value;
  const dailyPatternsIds = this.dailyPatternsId.value;
  const thoughtContentIds = this.thoughtContentId.value;

  const selectedAppearances = this.Appearance
    .filter(a => appearanceIds.includes(a.appearanceId))
    .map(a => ({ id: a.appearanceId}));

  const selectedSensorium = this.Sensorium
    .filter((s: any) => sensoriumIds.includes(s.sensoriumId))
    .map((s: any) => ({ id: s.sensoriumId }));

  const selectedFunctioning = this.Functioning
    .filter((s: any) => functioningIds.includes(s.functioningId))
    .map((s: any) => ({ id: s.functioningId}));

  const selectedSpeech = this.Speech
    .filter((s: any) => speechIds.includes(s.speechId))
    .map((s: any) => ({ id: s.speechId}));

  const selectedBehavior = this.Behavior
    .filter((s: any) => behaviorIds.includes(s.behaviorId))
    .map((s: any) => ({ id: s.behaviorId}));

  const selectedMoodAffect = this.MoodAffect
    .filter((s: any) => moodAffectIds.includes(s.moodAffectId))
    .map((s: any) => ({ id: s.moodAffectId}));

  const selectedDailyPattern = this.DailyPattern
    .filter((s: any) => dailyPatternsIds.includes(s.dailyPatternsId))
    .map((s: any) => ({ id: s.dailyPatternsId}));

  const selectedThoughtContent = this.ThoughtContent
    .filter((s: any) => thoughtContentIds.includes(s.thoughtContentId))
    .map((s: any) => ({ id: s.thoughtContentId}));

  this.listPatientMonthlyPReport = [{
   
    appearanceId: appearanceIds,
    sensoriumId: sensoriumIds,
    functioningId: functioningIds,
    speechId: speechIds,
    behaviorId: behaviorIds,
    moodAffectId: moodAffectIds,
    dailyPatternsId: dailyPatternsIds,
    thoughtContentId: thoughtContentIds
  }];

  console.log('Updated Monthly Report:', this.listPatientMonthlyPReport);
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
