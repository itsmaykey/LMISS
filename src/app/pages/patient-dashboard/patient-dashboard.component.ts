import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PatientDashboardService } from './service/patient-dashboard.service';

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
  NursingNotesForm!: FormGroup;
  PsychEvaluationReportForm!: FormGroup;
  TreatPlanReportForm!: FormGroup;
  DocOrderForm!: FormGroup;
   MedicationForm!: FormGroup;
  isSubmitting = false;
  fb: FormBuilder;
  viewNotesModalInstance: any;
  backDropModalInstance: any;
  backDropModalNursing: any;
   backDropModalPerMonth: any;
  bacDropMPPRReport: any;
  bacDropPEReport: any;
  bacDropPlanReport: any;
  backDropModalDocOrder: any;
  backDropModalMedication: any;
  viewNotesModal: any;
  viewPMMRModal: any;
  viewNursingNotesModal: any;
  swpnData: any;
  monthlyProgressData :any;
  nursingNotesData :any;
  swpnDataEdit: any;
  nursingNotesDataEdit: any;
  peEditData: any;
  peData: any;
  planData: any;
  isLoading: boolean | undefined;
  swpnFormArray: any = [];
  isEditingTbleView = true;
  isEditing : any;
  isEditingNurseNotes : any;
  isEditingNursingTbleView = true;
  isEditingMPPRView = true;
  staffList: any[] = [];
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
  domains: any = [];
   users: any[] = [];
    administratives: any[] = [];
    psychologists: any[] = [];
    psychometricians: any[] = [];
    medicalOfficers: any[] = [];
    nursing: any[] = [];
     socialWelfare: any[] = [];
  keys: any = [];
  currentRecNo: number | null = null;
  currentUserID: number | null = null;
  currentNursingRecNo: number | null = null;
  currentPERecNo: number | null = null;
  isLoadingNotes: boolean = false;  
   listPatientMonthlyPReport: any[] = [];
   listPatientMonthlyPReportView: any[] = [];
    listPatientMonthlyPReportToSave: any[] = [];
    listPatientPsychEvalReport: any[] = [];
    listTreatmentPlanReport: any[] = [];
    listDoctorOrderReport: any[] = [];
    listMedicationReport: any[] = [];
    listPsychologicalEvaluation: any[] = [];
  physicalFields = [
    'physicaIndicatorsId',
    'denialId',
    'physicalWsymptomsId',
    'suspensionofActivitiesId',
    'cravingsId',
    'appearanceId',
    'sensoriumId',
    'functioningId',
    'speechId',
    'behaviorId',
    'moodAffectId',
    'dailyPatternsId',
    'thoughtContentId',
    'otherObservations',
    'dateSubmitted',
 
  ];
  asignatoryFields = [
    'notedBy',
    'preparedBy'
  ];
onEditNotes(
  recNo: number,
  interventionDate: Date,
  code: string,
  patientCode: string,
  
  staffIdNo?: string
): void {

  this.isEditing = true;
  this.isEditingTbleView = false;
  this.currentRecNo = recNo;
  this['currentInterventionDate'] = interventionDate;

  const note = this.swpnDataEdit?.entity?.find((n: any) => n.recNo === recNo);

  if (note) {
    this.SocialWorkerNotesForm.patchValue({
      recNo: note.recNo,
      patientCode: note.patientCode ?? this.route.snapshot.paramMap.get('patientCode') ?? this.ExistedPatientCode,
      code: note.code ?? this.route.snapshot.paramMap.get('assessmentCode') ?? this.ExistedAssessmentCode,
      staffIdNo: note.staffIdNo ?? this.userInfo?.id ?? '',
      patientActivies: note.patientActivies,
      patientIntervention: note.patientIntervention,
      interventionDate: note.interventionDate
    });
  }
}
viewPEModalEdit(item: any): void {
  const record = item.fullData ?? item;
  const recNo = record.recNo;

  console.log('record.recNo:', recNo);
  console.log('this.peData:', this.peData);

  // Search properly based on structure
  const noteWrapper = this.peData?.find((n: any) =>
    String(n.recNo ?? n.fullData?.recNo) === String(recNo)
  );

  const note = noteWrapper?.fullData ?? noteWrapper;
  console.log("NOTE: ", note);

  if (!note) {
    console.warn('No matching note found for recNo:', recNo);
    return;
  }

  this.isEditing = true;
  this.isEditingTbleView = false;
  this.currentPERecNo = recNo;

  const formattedDateLog = this.formatDateLogMonthOnly(note.datelog);

  this.PsychEvaluationReportForm.patchValue({
    recNo: note.recNo,
    patientCode: note.patientCode ?? this.route.snapshot.paramMap.get('patientCode') ?? this.ExistedPatientCode,
    code: note.code ?? this.route.snapshot.paramMap.get('assessmentCode') ?? this.ExistedAssessmentCode,
    datelog: formattedDateLog,
    purposeForEvaluation: note.purposeForEvaluation,
    assessmentProcedures: note.assessmentProcedures,
    presentingProblems: note.presentingProblems,
    caseBackground: note.caseBackground,
    psychometricEvaluation: note.psychometricEvaluation,
    summary: note.summary,
    recommedation: note.recommedation,
    preparedBy: note.preparedBy?.staffIdNo ?? '',
    approvedBy: note.approvedBy?.staffIdNo ?? '',
    notedByF: note.notedByF?.staffIdNo ?? '',
    notedByS: note.notedByS?.staffIdNo ?? ''
  });

  setTimeout(() => {
    const modalElement = document.getElementById('viewPEModal');
    if (!modalElement) {
      console.error('Modal element not found in DOM');
      return;
    }
    this.bacDropPEReport = new Modal(modalElement);
    this.bacDropPEReport.show();
  }, 100);
}

viewPlanModalEdit(item: any): void {
  const record = item.fullData ?? item;
  const recNo = record.recNo;

  console.log('record.recNo:', recNo);
  console.log('this.planData:', this.planData);

  // Search properly based on structure
  const planWrapper = this.planData?.find((n: any) =>
    String(n.recNo ?? n.fullData?.recNo) === String(recNo)
  );

  const plan = planWrapper?.fullData ?? planWrapper;
  console.log("plan: ", plan);

  if (!plan) {
    console.warn('No matching note found for recNo:', recNo);
    return;
  }

  this.TreatPlanReportForm.patchValue({
    recNo: plan.recNo,
    patientCode: plan.patientCode ?? this.route.snapshot.paramMap.get('patientCode') ?? this.ExistedPatientCode,
    code: plan.code ?? this.route.snapshot.paramMap.get('assessmentCode') ?? this.ExistedAssessmentCode,
    dateIdentified: this.formatDateTimeLocal(plan.dateIdentified),
    patientDomainCode: plan.patientDomainCode,
    patientGoal: plan.patientGoal,
    patientProblem: plan.patientProblem,
    patientObjective: plan.patientObjective,
    patientIntervention: plan.patientIntervention,
    preparedBy: plan.preparedBy ?.staffIdNo ?? '',
    nurseCode: plan.nurseCode?.staffIdNo ?? '',
    psychometricianCode: plan.psychometricianCode?.staffIdNo ?? '',
    notedBy: plan.notedBy?.staffIdNo ?? '',
    approvedBy: plan.approvedBy?.staffIdNo ?? ''
  });
  setTimeout(() => {
    const modalElement = document.getElementById('viewPlanModal');
    if (!modalElement) {
      console.error('Modal element not found in DOM');
      return;
    }
    this.bacDropPlanReport = new Modal(modalElement);
    this.bacDropPlanReport.show();
  }, 100);
}
formatDateTimeLocal(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

formatDateLogMonthOnly(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}`; // "2025-06"
}



BackonEditNotes(): void {
  this.isEditing = false;
  this.isEditingTbleView = true;
}
onSaveNotes(): void {
     this.isEditing = false;
     this.isEditingTbleView = true;
     this.isSubmitting = true;

  const formData = {
  ...this.SocialWorkerNotesForm.value,
  recNo: this.currentRecNo,
  interventionDate: this['currentInterventionDate'] ? formatDate(this['currentInterventionDate'], 'yyyy-MM-dd', 'en-US') : ''
};

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
      this.hideModalSWPNotes();
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
onEditNursingNotes(
  recNo: number,
  dateSubmitted: Date,
  code?: string,
  patientCode?: string,
  staffIdNo?: string
): void {
  console.log('Editing record with recNo:', recNo);
  console.log('Nursing Date:', dateSubmitted);
  console.log('Code:', code);
  console.log('Patient Code:', patientCode);
  console.log('Staff ID No:', staffIdNo);
  
  this.isEditingNurseNotes = true;
  this.isEditingNursingTbleView = false;
  this.currentNursingRecNo = recNo;
  this['currentDateSubmitted'] = dateSubmitted;

  // Optional: store additional values if needed
  // this.currentCode = code;
  // this.currentPatientCode = patientCode;
  // this.currentStaffIdNo = staffIdNo;

  // Optional: find the full note object if needed
  const note = this.nursingNotesData?.entity?.find((n: any) => n.recNo === recNo);
  if (note) {
    this.NursingNotesForm.patchValue({
      remarks: note.remarks
    });
  }
}

BackonEditNursingNotes(): void {
  this.isEditingNurseNotes = false;
  this.isEditingNursingTbleView = true;
}
onSaveNursingNotes(): void {
     this.isEditingNurseNotes = false;
     this.isEditingNursingTbleView = true;
     this.isSubmitting = true;

  const formData = {
  ...this.NursingNotesForm.value,
  recNo: this.currentNursingRecNo,
  dateSubmitted: this['currentDateSubmitted'] ? formatDate(this['currentDateSubmitted'], 'yyyy-MM-dd', 'en-US') : ''
};

  console.log(formData);

  this.service.postPatientNursingNotes( formData ).subscribe({

    next: (response) => {
      console.log('Form saved successfully:', response);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Nursing notes report submitted successfully!',
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
       this.hideModalNursingNotes();
        this.NursingNotesForm.reset();
        this.isSubmitting = false;
        this.refreshNursingNotesData();
    },
    error: (error) => {
      console.error('Error saving form:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit Nursing Notes. Please try again.',
        showConfirmButton: true,
        allowOutsideClick: true,
        allowEscapeKey: true
      });

      this.isSubmitting = false;
    }
  });
  }
  onSavePE(): void {
    const form = this.PsychEvaluationReportForm;
  const patientCode = this.route.snapshot.paramMap.get('patientCode') || '';
    const assessmentCode = this.route.snapshot.paramMap.get('assessmentCode') || '';
    this.isSubmitting = true;
  // Validate form
  if (form.invalid) {
    form.markAllAsTouched();
    console.warn('Form is invalid:', form.errors);
    return;
  }
  
  const { datelog, ...restValues } = form.value;
  const formattedDatelog = this.formatDateLog(datelog);
  const formValues = this.PsychEvaluationReportForm.value;
  const isNew = !form.value.recNo || form.value.recNo === 0;

const payload = {
    listPsychologicalEvaluation: [
      {
        ...formValues,
      datelog: formattedDatelog,
      patientCode,
      code: assessmentCode,
      recNo: isNew ? 0 : formValues.recNo
      }
    ]
  };
  console.log(payload);

  this.service.postPatientPsychologicalEvaluationReport( payload ).subscribe({

    next: (response) => {
      console.log('Form saved successfully:', response);

      Swal.fire({
        icon: 'success',
        title: 'Success',
         text: 'Patient psychological evaluation submitted successfully!',
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
       this.hideModalPe();
        this.PsychEvaluationReportForm.reset();
        this.isSubmitting = false;
        this.refreshPEData();
    },
    error: (error) => {
      console.error('Error saving form:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit Psychological Evaluation. Please try again.',
        showConfirmButton: true,
        allowOutsideClick: true,
        allowEscapeKey: true
      });

      this.isSubmitting = false;
    }
  });
  }
   onSaveTreatment(): void {
    const form = this.TreatPlanReportForm;
  const patientCode = this.route.snapshot.paramMap.get('patientCode') || '';
    const assessmentCode = this.route.snapshot.paramMap.get('assessmentCode') || '';
    this.isSubmitting = true;
  // Validate form
  if (form.invalid) {
    form.markAllAsTouched();
    console.warn('Form is invalid:', form.errors);
    return;
  }
  
  const formValues = this.TreatPlanReportForm.value;
  const isNew = !form.value.recNo || form.value.recNo === 0;

const payload = {
    listPatientTreatmentPlan: [
      {
        ...formValues,
      patientCode,
      code: assessmentCode,
      recNo: isNew ? 0 : formValues.recNo
      }
    ]
  };
  console.log(payload);

  this.service.postPatientTreatmentPlan( payload ).subscribe({

    next: (response) => {
      console.log('Form saved successfully:', response);

      Swal.fire({
        icon: 'success',
        title: 'Success',
         text: 'Patient Treatment Plan submitted successfully!',
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
       this.hideModalPlan();
        this.TreatPlanReportForm.reset();
        this.isSubmitting = false;
        this.refreshPEData();
    },
    error: (error) => {
      console.error('Error saving form:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit Treatment Plan. Please try again.',
        showConfirmButton: true,
        allowOutsideClick: true,
        allowEscapeKey: true
      });

      this.isSubmitting = false;
    }
  });
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
 
    getStaffName(staffData: any, staffType: 'medical' | 'psychologist'): string {
      if (staffData && typeof staffData === 'object') {
        return staffData.uFullName || staffData.fullName || staffData.firstName + ' ' + staffData.lastName || staffData.name || 'Unknown Staff';
      }
      
      const staffId = Number(staffData);
      if (!staffId) return 'Not specified';
      
      const staffArray = staffType === 'medical' ? this.medicalOfficers : this.psychologists;
      const staff = staffArray?.find(s => s.staffIdNo === staffId);
      return staff ? staff.uFullName : 'Unknown Staff';
    }
  viewPerMonth(monthName: string): void {
  const patientCode = this.route.snapshot.paramMap.get('patientCode');
  const assessmentCode = this.route.snapshot.paramMap.get('assessmentCode');
  
  this.showModalPerMonth(); // Show modal

  if (patientCode && assessmentCode) {
    this.service.getExistedPatientMonthlyProgressReports(patientCode, assessmentCode).subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length > 0) {
          const filtered = response.find((item: any) => item.monthName === monthName);

          if (filtered) {
            // Save month & year (for display purposes)
            this['selectedMonthName'] = filtered.monthName;
            this['selectedYear'] = filtered.year;

            // Transform data into a format for table rendering
            this.listPatientMonthlyPReportView = [
              {
                section: 'Appearances',
                values: filtered.appearances?.map((a: any) => ({ label: a.appearanceDesc })) || []
              },
              {
                section: 'Sensoriums',
                values: filtered.sensoriums?.map((s: any) => ({ label: s.sensoriumDesc })) || []
              },
              {
                section: 'Functioning',
                values: filtered.functioning?.map((f: any) => ({ label: f.functioningDesc })) || []
              },
              {
                section: 'Speech',
                values: filtered.speech?.map((s: any) => ({ label: s.speechDesc })) || []
              },
              {
                section: 'Behavior',
                values: filtered.behavior?.map((b: any) => ({ label: b.behaviorDesc })) || []
              },
              {
                section: 'Mood/Affect',
                values: filtered.moodAffect?.map((m: any) => ({ label: m.moodAffectDesc })) || []
              },
              {
                section: 'Daily Pattern',
                values: filtered.dailyPattern?.map((d: any) => ({ label: d.dailyPatternsDesc })) || []
              },
              {
                section: 'Thought Content',
                values: filtered.thoughtContent?.map((t: any) => ({ label: t.thoughtContentDesc })) || []
              },
              {
                section: 'Physical Indicator',
                values: filtered.physicalIndicator?.map((p: any) => ({ label: p.physicaIndicatorsDesc })) || []
              },
              {
                section: 'Denial',
                values: filtered.denial?.map((d: any) => ({ label: d.denialDesc })) || []
              },
              {
                section: 'Physical Withdrawal Symptoms',
                values: filtered.physicalWSymptoms?.map((p: any) => ({ label: p.physicalWsymptomsDesc })) || []
              },
              {
                section: 'Suspension of Activity',
                values: filtered.suspensionofActivity?.map((s: any) => ({ label: s.suspensionofActivitiesDesc })) || []
              },
              {
                section: 'Cravings',
                values: filtered.cravings?.map((c: any) => ({ label: c.cravingsDesc })) || []
              },
              {
                section: 'Other Observation',
                values: filtered.otherObservation ? [{ label: filtered.otherObservation }] : []
              },
               {
              section: 'Noted By',
              values: filtered.notedBy ? [{ label: this.getStaffName(filtered.notedBy, 'medical') }] : []
            },
            {
              section: 'Prepared By',
              values: filtered.preparedBy ? [{ label: this.getStaffName(filtered.preparedBy, 'psychologist') }] : []
            }
            
            ];

            console.log('Monthly Progress Table Data:', this.listPatientMonthlyPReportView);
          } else {
            console.warn('No data found for month:', monthName);
          }
        } else {
          console.warn('No progress data found.');
        }
      },
      error: (error) => {
        console.error('Error fetching monthly progress report:', error);
      }
    });
  } else {
    console.error('Missing patientCode or assessmentCode in route parameters.');
  }
}
viewNursingNotes(recNo: string): void {
  const patientCode = this.route.snapshot.paramMap.get('patientCode');
  const assessmentCode = this.route.snapshot.paramMap.get('assessmentCode');

  if (patientCode && assessmentCode) {
    this.service.getExistedPatientNursingNotes(patientCode, assessmentCode).subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length > 0) {
          this.nursingNotesDataEdit = response[0];
        }

        if (this.nursingNotesDataEdit && this.nursingNotesDataEdit.entity && !Array.isArray(this.nursingNotesDataEdit.entity)) {
          this.nursingNotesDataEdit.entity = Object.values(this.nursingNotesDataEdit.entity);
        }

        if (recNo && this.nursingNotesDataEdit?.entity) {
          this.nursingNotesDataEdit.entity = this.nursingNotesDataEdit.entity.filter((item: any) => item.recNo == recNo);
        }
         const modalElement = document.getElementById('viewEditNursingNotesModal');
        if (!modalElement) {
        console.error('Modal element not found in DOM');
        return;
      }

     this.viewNursingNotesModal = new Modal(modalElement);
      this.viewNursingNotesModal.show();

   
        console.log('Filtered entity for recNo:', this.nursingNotesDataEdit.entity);
      },
      error: (error) => {
        console.error('Error fetching patient progress report:', error);
      }
    });
  } else {
    console.error('Missing patientCode or assessmentCode in route parameters.');
  }
}

  viewNotes(recNo: string): void {
  const patientCode = this.route.snapshot.paramMap.get('patientCode');
  const assessmentCode = this.route.snapshot.paramMap.get('assessmentCode');
  this.isEditing = false;
  this.isEditingTbleView = true;
   this.isLoadingNotes = true;
  if (patientCode && assessmentCode) {
    this.service.getPatientProgressReport(patientCode, assessmentCode).subscribe({
      next: (response) => {
         this.isLoadingNotes = false;
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

showModalPerMonth(): void {
  const modalElement = document.getElementById('viewMonthlyProgressPerMonth');
  if (!modalElement) {
    console.error('Modal element not found in DOM');
    return;
  }

  this.backDropModalPerMonth = new Modal(modalElement);
  this.backDropModalPerMonth.show();
}
showModal(): void {
  const modalElement = document.getElementById('backDropModal');
  if (!modalElement) {
    console.error('Modal element not found in DOM');
    return;
  }
  this.SocialWorkerNotesForm.reset();
  this.backDropModalInstance = new Modal(modalElement);
  this.backDropModalInstance.show();
}
showNursingModal(): void {
  const modalElement = document.getElementById('viewNusingNotesModal');
  if (!modalElement) {
    console.error('Modal element not found in DOM');
    return;
  }
  this.NursingNotesForm.reset();
  this.backDropModalNursing = new Modal(modalElement);
  this.backDropModalNursing.show();
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
showModalPE(): void {
  this.PsychEvaluationReportForm.reset();
  const modalElement = document.getElementById('viewPEModal');
  if (!modalElement) {
    console.error('Modal element not found in DOM');
    return;
  }

 this.bacDropPEReport = new Modal(modalElement);
  this.bacDropPEReport.show();
}
showModalPlan(): void {
  this.TreatPlanReportForm.reset();
  const modalElement = document.getElementById('viewPlanModal');
  if (!modalElement) {
    console.error('Modal element not found in DOM');
    return;
  }

 this.bacDropPlanReport = new Modal(modalElement);
  this.bacDropPlanReport.show();
}
showModalDocOrder(): void {
  this.DocOrderForm.reset();
  const modalElement = document.getElementById('viewDocOrderModal');
  if (!modalElement) {
    console.error('Modal element not found in DOM');
    return;
  }

 this.backDropModalDocOrder = new Modal(modalElement);
  this.backDropModalDocOrder.show();
}
showModalMedication(): void {
  this.MedicationForm.reset();
  const modalElement = document.getElementById('viewMedicationModal');
  if (!modalElement) {
    console.error('Modal element not found in DOM');
    return;
  }

 this.backDropModalMedication = new Modal(modalElement);
  this.backDropModalMedication.show();
}
  hideModal(): void {
    this.backDropModalInstance?.hide();
  }
  hideModalNursing(): void {
    this.backDropModalNursing?.hide();
  }
  hideModalSWPNotes(): void {
    this.viewNotesModal?.hide();
  }
  hideModalNursingNotes(): void {
    this.viewNursingNotesModal?.hide();
  }
   hideModaviewPMMRModal(): void {
    this.bacDropMPPRReport?.hide();
  }
  hideModalPe(): void {
    this.bacDropPEReport?.hide();
  }
  hideModalPlan(): void {
    this.bacDropPlanReport?.hide();
  }
  hideModalDoctorOrder(): void {
    this.backDropModalDocOrder?.hide();
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
     const today = new Date().toISOString().split('T')[0];
     this.userInfo = this.authService.getUserInfo();
    console.log('Staff ID No:', this.userInfo.id);
    this.currentUserID = this.userInfo.id;

    const assessmentCode = this.route.snapshot.paramMap.get('assessmentCode');
    const patientCode = this.route.snapshot.paramMap.get('patientCode') || '';
    this.ExistedPatientCode = patientCode;
    this.ExistedAssessmentCode = assessmentCode || '';
    console.log('Existed Patient Code:', this.ExistedPatientCode);
    console.log('Existed Assessment Code:', this.ExistedAssessmentCode);
     this.userInfo = this.authService.getUserInfo();

       
        this.SocialWorkerNotesForm = this.fb.group({
            recNo: [0],
            patientCode: [''],
            code: [''],
            staffIdNo: [''],
            patientActivies: ['', Validators.required],
            patientIntervention: ['', Validators.required],
            interventionDate: ['', Validators.required]
          });

          // ✅ PATCH after form creation
          this.SocialWorkerNotesForm.patchValue({
            patientCode: patientCode || this.ExistedPatientCode,
            code: assessmentCode || this.ExistedAssessmentCode,
            staffIdNo: this.userInfo?.id || ''
          });



    this.NursingNotesForm = this.fb.group({
      recNo: 0,
      patientCode: patientCode,
      code: assessmentCode,
      staffIdNo: this.userInfo.id,
      remarks: ['', Validators.required],
      dateSubmitted: ['', Validators.required]
    });
    this.MentalStatusForm = this.fb.group({
    appearanceId: this.fb.array([]),
    sensoriumId: this.fb.array([]),
    functioningId: this.fb.array([]),
    speechId: this.fb.array([]),
    behaviorId: this.fb.array([]),
    moodAffectId: this.fb.array([]),
    dailyPatternsId: this.fb.array([]),
    thoughtContentId: this.fb.array([]),
    physicaIndicatorsId: this.fb.array([]),
    denialId: this.fb.array([]),
    physicalWsymptomsId: this.fb.array([]),
    suspensionofActivitiesId: this.fb.array([]),
    cravingsId: this.fb.array([]),
    otherObservations: ['', Validators.required],
    dateSubmitted: ['', Validators.required],
    notedBy: ['', Validators.required],
    preparedBy: ['', Validators.required],
  }, {
    validators: [
      this.requireAtLeastOnePerFieldValidator.bind(this),
      this.requireAtLeastOnePhysicalValidator.bind(this)
    ]
    
  });
     this.PsychEvaluationReportForm = this.fb.group({
  recNo: [0],
  patientCode: [patientCode],
  code: [assessmentCode],
  datelog: ['', Validators.required],
  purposeForEvaluation: ['', Validators.required],
  assessmentProcedures: ['', Validators.required],
  presentingProblems: ['', Validators.required],
  caseBackground: ['', Validators.required],
  psychometricEvaluation: ['', Validators.required],
  summary: ['', Validators.required],
  recommedation: ['', Validators.required],
  preparedBy: ['', Validators.required],
  approvedBy: ['', Validators.required],
  notedByF: ['', Validators.required],
  notedByS: ['', Validators.required],
});
console.log(this.PsychEvaluationReportForm.value);

  this.TreatPlanReportForm = this.fb.group({
  recNo: [0],
  patientCode: [patientCode],
  code: [assessmentCode],
  dateIdentified: ['', Validators.required],
  patientDomainCode: ['', Validators.required],
  patientProblem: ['', Validators.required],
  patientGoal: ['', Validators.required],
  patientObjective: ['', Validators.required],
  patientIntervention: ['', Validators.required],
  preparedBy: ['', Validators.required],
  notedBy: ['', Validators.required],
  approvedBy: ['', Validators.required],
  nurseCode: ['', Validators.required],
  psychometricianCode: ['', Validators.required],
});
console.log(this.TreatPlanReportForm.value);
 this.DocOrderForm = this.fb.group({
  recNo: [0],
  patientCode: [patientCode],
  code: [assessmentCode],
  dateIdentified: ['', Validators.required],
  patientDomainCode: ['', Validators.required],
  patientProblem: ['', Validators.required],
  patientGoal: ['', Validators.required],
  patientObjective: ['', Validators.required],
  patientIntervention: ['', Validators.required],
  preparedBy: ['', Validators.required],
  notedBy: ['', Validators.required],
  approvedBy: ['', Validators.required],
  nurseCode: ['', Validators.required],
  psychometricianCode: ['', Validators.required],
});
console.log(this.DocOrderForm.value);
 this.MedicationForm = this.fb.group({
  recNo: [0],
  patientCode: [patientCode],
  code: [assessmentCode],
  dateIdentified: ['', Validators.required],
  patientDomainCode: ['', Validators.required],
  patientProblem: ['', Validators.required],
  patientGoal: ['', Validators.required],
  patientObjective: ['', Validators.required],
  patientIntervention: ['', Validators.required],
  preparedBy: ['', Validators.required],
  notedBy: ['', Validators.required],
  approvedBy: ['', Validators.required],
  nurseCode: ['', Validators.required],
  psychometricianCode: ['', Validators.required],
});
console.log(this.MedicationForm.value);

  this.PsychEvaluationReportForm.valueChanges.subscribe(() => {
    this.updateSummaryTable();
  });
  this.TreatPlanReportForm.valueChanges.subscribe(() => {
    this.updatePlanSummaryTable();
  });
this.DocOrderForm.valueChanges.subscribe(() => {
    this.updateOrderSummaryTable();
  });
  this.MedicationForm.valueChanges.subscribe(() => {
    this.updateMedicationSummaryTable();
  });
   this.updatePlanSummaryTable();
  this.updateSummaryTable();
  this.updateOrderSummaryTable();
  this.updateMedicationSummaryTable();
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
     this.service.getrefDomain().subscribe({
      next: (response) => {
        this.domains = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
     this.service.getUsers().subscribe({
      next: (response) => {
        console.log('API response:', response);

        // Defensive check
        if (Array.isArray(response)) {
          this.users = response;

          this.administratives = this.users.filter(user => user.posCode === 'sa001');
          this.psychologists = this.users.filter(user => user.posCode === 'p002');
          this.psychometricians = this.users.filter(user => user.posCode === 'pc001');
          this.medicalOfficers = this.users.filter(user => user.posCode === 'mo001');
          this.nursing = this.users.filter(user => user.posCode === 'n001');
           this.socialWelfare = this.users.filter(user => user.posCode === 'sw001');
          console.log('users:', this.users);
          console.log('nursing:', this.nursing);
          console.log('socialWelfare:', this.socialWelfare);
          console.log('Medical Officers:', this.medicalOfficers);
        } else {
          console.error('Expected array, got:', typeof response);
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
    
  }
  formatDateToMonth(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`; // e.g., "2025-07"
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
 if (patientCode && assessmentCode) {
  this.service.getExistedPatientMonthlyProgressReports(patientCode, assessmentCode)
    .subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length > 0) {
          // store the entire array (all months)
          this.monthlyProgressData = response;
          console.log('Monthly Progress Data:', this.monthlyProgressData);
        } else if ((response as any)?.entity && typeof (response as any).entity === 'object') {
          // fallback if it's an object instead of array
          this.monthlyProgressData = Object.values((response as any).entity);
        } else {
          console.warn('Unexpected response format', response);
        }
      },
      error: (err) => {
        console.error('Error loading monthly progress:', err);
      }
    });
} else {
  console.error('Missing patientCode or assessmentCode in route.');
}
if (patientCode && assessmentCode) {
  this.service.getExistedPatientNursingNotes(patientCode, assessmentCode)
    .subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length > 0) {
          this.nursingNotesData = response[0];
          console.log('Monthly nursingNotes Data:', this.nursingNotesData);
        } else if ((response as any)?.entity && typeof (response as any).entity === 'object') {
          this.nursingNotesData = Object.values((response as any).entity);
        } else {
          console.warn('Unexpected response format', response);
        }
      },
      error: (err) => {
        console.error('Error loading nursingNotesData', err);
      }
    });
} else {
  console.error('Missing patientCode or assessmentCode in route.');
}
if (patientCode && assessmentCode) {
  this.service.getExistedPatientPsychologicalEvaluationReport(patientCode, assessmentCode).subscribe({
    next: (response) => {
  console.log('API full response:', response);

  if (Array.isArray(response) && response.length > 0) {
  this.peData = response.map((item) => {
    const date = new Date(item.datelog);
    const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    return {
      monthName,
      fullData: item
    };
  });
} else {
  console.warn('No response data or not an array.');
  this.peData = [];
}


  console.log('peData:', this.peData);
},
    error: (error) => {
      console.error('Error fetching patient psychological evaluation report:', error);
    }
  });
} else {
  console.error('Missing patientCode or assessmentCode in route parameters.');
}
if (patientCode && assessmentCode) {
  this.service.getExistedPatientTreatmentPlan(patientCode, assessmentCode).subscribe({
    next: (response) => {
      console.log('API full response:', response);

      if (Array.isArray(response) && response.length > 0) {
        this.planData = response.map((item) => ({
        recNo: item.recNo,
        patientDomainDesc: item.patientDomainDesc, 
        dateIdentified: item.dateIdentified, 
        fullData: item
      }));

      } else {
        console.warn('No response data or not an array.');
        this.planData = [];
      }

      console.log('planData by recNo:', this.planData);
    },
    error: (error) => {
      console.error('Error fetching patient treatment plan:', error);
    }
  });
} else {
  console.error('Missing patientCode or assessmentCode in route parameters.');
}

    }
    refreshNursingNotesData(): void {
      const patientCode = this.route.snapshot.paramMap.get('patientCode');
      const assessmentCode = this.route.snapshot.paramMap.get('assessmentCode');
      if (patientCode && assessmentCode) {
  this.service.getExistedPatientNursingNotes(patientCode, assessmentCode)
    .subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length > 0) {
          this.nursingNotesData = response[0];
          console.log('Monthly nursingNotes Data:', this.nursingNotesData);
        } else if ((response as any)?.entity && typeof (response as any).entity === 'object') {
          this.nursingNotesData = Object.values((response as any).entity);
        } else {
          console.warn('Unexpected response format', response);
        }
      },
      error: (err) => {
        console.error('Error loading nursingNotesData', err);
      }
    });
} else {
  console.error('Missing patientCode or assessmentCode in route.');
}
    }
refreshMonthlyProgressData(): void {
  const patientCode = this.route.snapshot.paramMap.get('patientCode');
  const assessmentCode = this.route.snapshot.paramMap.get('assessmentCode');
  if (!patientCode || !assessmentCode) {
    console.error('Missing patientCode or assessmentCode in route.');
    return;
  }

  this.service.getExistedPatientMonthlyProgressReports(patientCode, assessmentCode)
    .subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.monthlyProgressData = response;
          console.log('Monthly Progress Data:', this.monthlyProgressData);
        } else if (response && typeof response === 'object' && 'entity' in response) {
          const entity = (response as any).entity;
          if (entity && typeof entity === 'object') {
            this.monthlyProgressData = Object.values(entity);
            console.log('Monthly Progress (from entity):', this.monthlyProgressData);
          } else {
            console.warn('Entity is not a valid object:', entity);
            this.monthlyProgressData = [];
          }
        } else {
          console.warn('Unexpected response format:', response);
          this.monthlyProgressData = [];
        }
      },
      error: (err) => {
        console.error('Error loading monthly progress:', err);
      }
    });
    
}
refreshPEData(): void {
  const patientCode = this.route.snapshot.paramMap.get('patientCode');
  const assessmentCode = this.route.snapshot.paramMap.get('assessmentCode');
  if (!patientCode || !assessmentCode) {
    console.error('Missing patientCode or assessmentCode in route.');
    return;
  }

  this.service.getExistedPatientPsychologicalEvaluationReport(patientCode, assessmentCode).subscribe({
    next: (response) => {
      console.log('API full response:', response);

      if (Array.isArray(response) && response.length > 0) {
        this.peData = response.map((item) => {
          const date = new Date(item.datelog);
          const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

          return {
            monthName,
            fullData: item
          };
        });
      } else {
        console.warn('No response data or not an array.');
        this.peData = [];
      }

      console.log('peData:', this.peData);
    },
    error: (error) => {
      console.error('Error fetching patient psychological evaluation report:', error);
    }
  });
    
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
updateSummaryTable() {
  const formData = this.PsychEvaluationReportForm.value;

  this.listPatientPsychEvalReport = [

    { section: 'Date Submitted', values: [{ label: formData.datelog || '' }] },
    { section: 'II. Purpose for Evaluation', values: [{ label: formData.purposeForEvaluation || '' }] },
    { section: 'III. Assessment Procedure', values: [{ label: formData.assessmentProcedures || '' }] },
    { section: 'IV. Presenting Problems/Complaints', values: [{ label: formData.presentingProblems || '' }] },
    { section: 'V. Case Background', values: [{ label: formData.caseBackground || '' }] },
    { section: 'VI. PsychoMetric Evaluation', values: [{ label: formData.psychometricEvaluation || '' }] },
    { section: 'VII. Summary', values: [{ label: formData.summary || '' }] },
    { section: 'VIII. Recommendations', values: [{ label: formData.recommedation || '' }] },
  ];
}
updatePlanSummaryTable() {
  const formData = this.TreatPlanReportForm.value;
  const domainDesc = this.domains.find((d: any) => d.domainCode === formData.patientDomainCode)?.domainDesc || '';
  this.listTreatmentPlanReport = [

     { 
      section: 'Date Identified', 
      values: [
        { 
          label: formData.dateIdentified 
            ? formatDate(formData.dateIdentified, 'MMMM d, yyyy', 'en-US') 
            : '' 
        }
      ] 
    },
     { section: 'Domain', values: [{ label: domainDesc }] },
    { section: 'Problem', values: [{ label: formData.patientProblem || '' }] },
    { section: 'Goal', values: [{ label: formData.patientGoal || '' }] },
    { section: 'Objective', values: [{ label: formData.patientObjective || '' }] },
    { section: 'Intervention', values: [{ label: formData.patientIntervention || '' }] },
    { section: 'prepared By', values: [{ label: formData.preparedBy || '' }] },
    { section: 'Nurse', values: [{ label: formData.nurseCode || '' }] },
    { section: 'Psychometrician', values: [{ label: formData.psychometricianCode || '' }] },
    { section: 'Administrative Officer', values: [{ label: formData.notedBy || '' }] },
    { section: 'Medical Officer', values: [{ label: formData.approvedBy || '' }] },
  ];
}
updateOrderSummaryTable() {
  const formData = this.DocOrderForm.value;
  const domainDesc = this.domains.find((d: any) => d.domainCode === formData.patientDomainCode)?.domainDesc || '';
  this.listDoctorOrderReport = [

     { 
      section: 'Date Ordered', 
      values: [
        { 
          label: formData.dateIdentified 
            ? formatDate(formData.dateIdentified, 'MMMM d, yyyy', 'en-US') 
            : '' 
        }
      ] 
    },
     { section: 'Subjective', values: [{ label: domainDesc }] },
    { section: 'Physical Examination', values: [{ label: formData.patientProblem || '' }] },
    { section: 'Assessment', values: [{ label: formData.patientGoal || '' }] },
    { section: 'Intervention', values: [{ label: formData.patientIntervention || '' }] },
    { section: 'Ordered By', values: [{ label: formData.preparedBy || '' }] },
    // { section: 'Psychometrician', values: [{ label: formData.psychometricianCode || '' }] },
    // { section: 'Administrative Officer', values: [{ label: formData.notedBy || '' }] },
    // { section: 'Medical Officer', values: [{ label: formData.approvedBy || '' }] },
  ];
}
updateMedicationSummaryTable() {
  const formData = this.MedicationForm.value;
  const domainDesc = this.domains.find((d: any) => d.domainCode === formData.patientDomainCode)?.domainDesc || '';
  this.listMedicationReport = [

     { 
      section: 'Medication Start', 
      values: [
        { 
          label: formData.dateIdentified 
            ? formatDate(formData.dateIdentified, 'MMMM d, yyyy', 'en-US') 
            : '' 
        }
      ] 
    },
     { section: 'Medication', values: [{ label: domainDesc }] },
    { section: 'Preparation', values: [{ label: formData.patientProblem || '' }] },
    { section: 'Dose Form', values: [{ label: formData.patientGoal || '' }] },
    { section: 'Route', values: [{ label: formData.patientIntervention || '' }] },
    { section: 'Dosage', values: [{ label: formData.patientIntervention || '' }] },
    { section: 'Duration', values: [{ label: formData.patientIntervention || '' }] },
    { section: 'Quantity to Dispense', values: [{ label: formData.patientIntervention || '' }] },
    { section: 'Indication', values: [{ label: formData.preparedBy || '' }] },
    { section: 'Prescribed by', values: [{ label: formData.preparedBy || '' }] },
    // { section: 'Psychometrician', values: [{ label: formData.psychometricianCode || '' }] },
    // { section: 'Administrative Officer', values: [{ label: formData.notedBy || '' }] },
    // { section: 'Medical Officer', values: [{ label: formData.approvedBy || '' }] },
  ];
}
async downloadReport(reportName: string) {
  const response = await fetch(`/Reports/ExportReport?reportName=${reportName}`);
  const blob = await response.blob();

  // Create a temporary download link
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${reportName}.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Call it from your app, e.g.:
// this.downloadReport("MyReport");

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

  NursingNotesFormSubmit(): void {
    if (this.NursingNotesForm.invalid) {
      this.NursingNotesForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formData = this.NursingNotesForm.value;
    console.log(formData);

    this.service.postPatientNursingNotes( formData ).subscribe({

      next: (response) => {
        console.log('Form saved successfully:', response);

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Patient nursing notes submitted successfully!',
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        this.hideModalNursing();
        this.NursingNotesForm.reset();
        this.isSubmitting = false;
        this.refreshNursingNotesData();
      },
      error: (error) => {
        console.error('Error saving form:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to submit nursing notes. Please try again.',
          showConfirmButton: true,
          allowOutsideClick: true,
          allowEscapeKey: true
        });

        this.isSubmitting = false;
      }
    });
  }

  SocialWorkerNotesFormSubmit(): void {
 
  if (this.SocialWorkerNotesForm.invalid) {
    this.SocialWorkerNotesForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;

  // Ensure patientCode, code, and staffIdNo are set before submit
  this.SocialWorkerNotesForm.patchValue({
    recNo: 0, // Reset recNo to 0 for new submission
    patientCode: this.route.snapshot.paramMap.get('patientCode') || this.ExistedPatientCode,
    code: this.route.snapshot.paramMap.get('assessmentCode') || this.ExistedAssessmentCode,
    staffIdNo: this.userInfo?.id || ''
  });
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
onSubmitMedicationForm(): void {
 
  if (this.MedicationForm.invalid) {
    this.MedicationForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;

  // Ensure patientCode, code, and staffIdNo are set before submit
  this.MedicationForm.patchValue({
    recNo: 0, // Reset recNo to 0 for new submission
    patientCode: this.route.snapshot.paramMap.get('patientCode') || this.ExistedPatientCode,
    code: this.route.snapshot.paramMap.get('assessmentCode') || this.ExistedAssessmentCode,
    staffIdNo: this.userInfo?.id || ''
  });
  const formData = this.MedicationForm.value;
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
      this.MedicationForm.reset();
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
    get physicaIndicatorsId() {
    return this.MentalStatusForm.get('physicaIndicatorsId') as FormArray;
  }
  get denialId() {
    return this.MentalStatusForm.get('denialId') as FormArray;
  }
  get physicalWsymptomsId() {
    return this.MentalStatusForm.get('physicalWsymptomsId') as FormArray;
  }
  get suspensionofActivitiesId() {
    return this.MentalStatusForm.get('suspensionofActivitiesId') as FormArray;
  }
  get cravingsId() {
    return this.MentalStatusForm.get('cravingsId') as FormArray;
  }
  get otherObservations() {
  return this.MentalStatusForm.get('otherObservations') as FormControl;
}
   dateSubmitted() {
  return this.MentalStatusForm.get('dateSubmitted') as FormControl;
}
  get notedBy() {
  return this.MentalStatusForm.get('notedBy') as FormControl;
}
  get preparedBy() {
  return this.MentalStatusForm.get('preparedBy') as FormControl;
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
  onPhysicaIndicatorCheckboxChange(event: any, item: any): void {
  const physicaIndicatorsIdArray = this.physicaIndicatorsId;
  const isChecked = event.target.checked;

  if (isChecked) {
    if (!physicaIndicatorsIdArray.value.includes(item.physicaIndicatorsId)) {
      physicaIndicatorsIdArray.push(this.fb.control(item.physicaIndicatorsId));
    }
  } else {
    const index = physicaIndicatorsIdArray.controls.findIndex(
      control => control.value === item.physicaIndicatorsId
    );
    if (index !== -1) {
      physicaIndicatorsIdArray.removeAt(index);
    }
  }


  this.updateMonthlyReport();
}
 onDenialIdCheckboxChange(event: any, item: any): void {
  const denialIddArray = this.denialId;
  const isChecked = event.target.checked;

  if (isChecked) {
    if (!denialIddArray.value.includes(item.denialId)) {
      denialIddArray.push(this.fb.control(item.denialId));
    }
  } else {
    const index = denialIddArray.controls.findIndex(
      control => control.value === item.denialId
    );
    if (index !== -1) {
      denialIddArray.removeAt(index);
    }
  }


  this.updateMonthlyReport();
}
onPhysicalWsympCheckboxChange(event: any, item: any): void {
  const physicalWsymptomsIddArray = this.physicalWsymptomsId;
  const isChecked = event.target.checked;

  if (isChecked) {
    if (!physicalWsymptomsIddArray.value.includes(item.physicalWsymptomsId)) {
      physicalWsymptomsIddArray.push(this.fb.control(item.physicalWsymptomsId));
    }
  } else {
    const index = physicalWsymptomsIddArray.controls.findIndex(
      control => control.value === item.physicalWsymptomsId
    );
    if (index !== -1) {
      physicalWsymptomsIddArray.removeAt(index);
    }
  }


  this.updateMonthlyReport();
}
onSuspensionofActCheckboxChange(event: any, item: any): void {
  const suspensionofActivitiesIddArray = this.suspensionofActivitiesId;
  const isChecked = event.target.checked;

  if (isChecked) {
    if (!suspensionofActivitiesIddArray.value.includes(item.suspensionofActivitiesId)) {
      suspensionofActivitiesIddArray.push(this.fb.control(item.suspensionofActivitiesId));
    }
  } else {
    const index = suspensionofActivitiesIddArray.controls.findIndex(
      control => control.value === item.suspensionofActivitiesId
    );
    if (index !== -1) {
      suspensionofActivitiesIddArray.removeAt(index);
    }
  }


  this.updateMonthlyReport();
}
  onCravingsCheckboxChange(event: any, item: any): void {
  const cravingsIddArray = this.cravingsId;
  const isChecked = event.target.checked;

  if (isChecked) {
    if (!cravingsIddArray.value.includes(item.cravingsId)) {
      cravingsIddArray.push(this.fb.control(item.cravingsId));
    }
  } else {
    const index = cravingsIddArray.controls.findIndex(
      control => control.value === item.cravingsId
    );
    if (index !== -1) {
      cravingsIddArray.removeAt(index);
    }
  }


  this.updateMonthlyReport();
}
onSaveNext(): void {
 this.markFieldsAsTouched(this.asignatoryFields);
 const hasInvalid = this.asignatoryFields.some(field => {
    const control = this.MentalStatusForm.get(field);
    return !control?.touched || (control?.value?.length || 0) === 0;
  });

  if (hasInvalid) {
    return; 
  }
  this.isSubmitting = true;

  const appearanceIds = this.appearanceId.value;
  const sensoriumIds = this.sensoriumId.value;
  const functioningIds = this.functioningId.value;
  const speechIds = this.speechId.value;
  const behaviorIds = this.behaviorId.value;
  const moodAffectIds = this.moodAffectId.value;
  const dailyPatternsIds = this.dailyPatternsId.value;
  const thoughtContentIds = this.thoughtContentId.value;
  const physicaIndicatorsIds = this.physicaIndicatorsId.value;
  const denialIds = this.denialId.value;
  const physicalWsymptomsIds = this.physicalWsymptomsId.value;
  const suspensionofActivitiesIds = this.suspensionofActivitiesId.value;
  const cravingsIds = this.cravingsId.value;
  const otherObservations = this.otherObservations.value || '';
  const patientCode = this.route.snapshot.paramMap.get('patientCode') || '';
  const assessmentCode = this.route.snapshot.paramMap.get('assessmentCode') || '';
  const dateSubmitted = this.dateSubmitted().value;
  this.listPatientMonthlyPReportToSave = [];
  
  // Convert to integers with proper fallback
  const notedBy = parseInt(this.notedBy.value) || 0;
  const preparedBy = parseInt(this.preparedBy.value) || 0;

  // Compute dateSubmittedValue in the same way as updateMonthlyReport
  let dateSubmittedValue: string | null = null;
  if (dateSubmitted) {
    const [year, month] = dateSubmitted.split('-').map(Number);
    const fullDate = new Date(Date.UTC(year, month - 1, 1));
    dateSubmittedValue = fullDate.toISOString();
  }

  const maxLength = Math.max(
    appearanceIds.length,
    sensoriumIds.length,
    functioningIds.length,
    speechIds.length,
    behaviorIds.length,
    moodAffectIds.length,
    dailyPatternsIds.length,
    thoughtContentIds.length,
    physicaIndicatorsIds.length,
    denialIds.length,
    physicalWsymptomsIds.length,
    suspensionofActivitiesIds.length,
    cravingsIds.length,
  );

  for (let i = 0; i < maxLength; i++) {
    this.listPatientMonthlyPReportToSave.push({
      recNo: 0,
      patientCode: patientCode,
      code: assessmentCode,
      appearanceId: appearanceIds[i] || 0,
      sensoriumId: sensoriumIds[i] || 0,
      functioningId: functioningIds[i] || 0,
      speechId: speechIds[i] || 0,
      behaviorId: behaviorIds[i] || 0,
      moodAffectId: moodAffectIds[i] || 0,
      dailyPatternsId: dailyPatternsIds[i] || 0,
      thoughtContentId: thoughtContentIds[i] || 0,
      physicalIndicatorsId: physicaIndicatorsIds[i] || 0,
      denialId: denialIds[i] || 0,
      physicalWsymptomsId: physicalWsymptomsIds[i] || 0,
      suspensionofActivitiesId: suspensionofActivitiesIds[i] || 0,
      cravingsId: cravingsIds[i] || 0,
      otherObservations: otherObservations?.trim() || '',
      dateSubmitted: dateSubmittedValue,
      notedBy: notedBy,
      preparedBy: preparedBy
    });
  }

  const formData = {
    listPatientMonthlyPReport: this.listPatientMonthlyPReportToSave
  };

  console.log('Submitting:', formData);

  this.service.postPatientMonthlyProgressReport(formData).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Patient progress report submitted successfully!',
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      this.hideModaviewPMMRModal();
      this.MentalStatusForm.reset();
      this.isSubmitting = false;
      this.refreshMonthlyProgressData();
      this.listPatientMonthlyPReport = [];
    },
    error: (err) => {
      console.error('Submission failed:', err);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit report. Please try again.',
        showConfirmButton: true
      });

      this.isSubmitting = false;
    }
  });
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
  const physicaIndicatorsIds = this.physicaIndicatorsId.value;
  const denialIds = this.denialId.value;
  const physicalWsymptomsIds = this.physicalWsymptomsId.value;
  const suspensionofActivitiesIds = this.suspensionofActivitiesId.value;
  const cravingsIds = this.cravingsId.value;
  const patientCode = this.route.snapshot.paramMap.get('patientCode');
  const assessmentCode = this.route.snapshot.paramMap.get('assessmentCode');
  const otherObservations = this.MentalStatusForm.get('otherObservations')?.value;
  const monthValue = this.MentalStatusForm.get('dateSubmitted')?.value;
  const notedBy = this.notedBy.value;
  const preparedBy = this.preparedBy.value;
  let dateSubmittedValue: string | null = null;

    if (monthValue) {
      const [year, month] = monthValue.split('-').map(Number);
      const fullDate = new Date(Date.UTC(year, month - 1, 1)); // 1st day, UTC midnight
      dateSubmittedValue = fullDate.toISOString(); // "2025-07-01T00:00:00.000Z"
    }
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
  const selectedPhysicInd = this.PhysicIndicators
    .filter((s: any) => physicaIndicatorsIds.includes(s.physicaIndicatorsId))
    .map((s: any) => ({ id: s.physicaIndicatorsId}));
 const selectedDenial = this.Denial
    .filter((s: any) => denialIds.includes(s.denialId))
    .map((s: any) => ({ id: s.denialId}));

  const selectedPhysicalWsymp = this.WithdSymptoms
    .filter((s: any) => physicalWsymptomsIds.includes(s.physicalWsymptomsId))
    .map((s: any) => ({ id: s.physicalWsymptomsId}));

  const selectedTSuspensionofActi = this.SuspenActivities
    .filter((s: any) => suspensionofActivitiesIds.includes(s.suspensionofActivitiesId))
    .map((s: any) => ({ id: s.suspensionofActivitiesId}));

  const selectedTCraving = this.Cravings
    .filter((s: any) => cravingsIds.includes(s.cravingsId))
    .map((s: any) => ({ id: s.cravingsId}));
  // Replace the incorrect selectednotedBy and selectedpreparedBy with these:

  const selectednotedBy = this.medicalOfficers
    .filter((s: any) => s.staffIdNo === notedBy)
    .map((s: any) => ({ id: s.staffIdNo }));
    
  const selectedpreparedBy = this.psychologists
    .filter((s: any) => s.staffIdNo === preparedBy)
    .map((s: any) => ({ id: s.staffIdNo }));
    
  // Format the dateSubmittedValue as "Month Day, Year" (e.g., "June 1, 2025")
  let formattedMonth = '';
  if (dateSubmittedValue) {
    const dateObj = new Date(dateSubmittedValue);
    // Always display as the first day of the month
    formattedMonth = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

 this.listPatientMonthlyPReport = [
  {
    section: 'Appearance',
    values: this.Appearance
      .filter(a => appearanceIds.includes(a.appearanceId))
      .map(a => ({ id: a.appearanceId, label: a.appearanceDesc }))
  },
  {
    section: 'Sensorium',
    values: this.Sensorium
      .filter((s: any) => sensoriumIds.includes(s.sensoriumId))
      .map((s: any) => ({ id: s.sensoriumId, label: s.sensoriumDesc }))
  },
  {
    section: 'Functioning',
    values: this.Functioning
      .filter((s: any) => functioningIds.includes(s.functioningId))
      .map((s: any) => ({ id: s.functioningId, label: s.functioningDesc }))
  },
  {
    section: 'Speech',
    values: this.Speech
      .filter((s: any) => speechIds.includes(s.speechId))
      .map((s: any) => ({ id: s.speechId, label: s.speechDesc }))
  },
  {
    section: 'Behavior',
    values: this.Behavior
      .filter((s: any) => behaviorIds.includes(s.behaviorId))
      .map((s: any) => ({ id: s.behaviorId, label: s.behaviorDesc }))
  },
  {
    section: 'Mood/Affect',
    values: this.MoodAffect
      .filter((s: any) => moodAffectIds.includes(s.moodAffectId))
      .map((s: any) => ({ id: s.moodAffectId, label: s.moodAffectDesc }))
  },
  {
    section: 'Daily Patterns',
    values: this.DailyPattern
      .filter((s: any) => dailyPatternsIds.includes(s.dailyPatternsId))
      .map((s: any) => ({ id: s.dailyPatternsId, label: s.dailyPatternsDesc }))
  },
  {
    section: 'Thought Content',
    values: this.ThoughtContent
      .filter((s: any) => thoughtContentIds.includes(s.thoughtContentId))
      .map((s: any) => ({ id: s.thoughtContentId, label: s.thoughtContentDesc }))
  },
  {
    section: 'Physical Indicators',
    values: this.PhysicIndicators
      .filter((s: any) => physicaIndicatorsIds.includes(s.physicaIndicatorsId))
      .map((s: any) => ({ id: s.physicaIndicatorsId, label: s.physicaIndicatorsDesc }))
  },
  {
    section: 'Denial',
    values: this.Denial
      .filter((s: any) => denialIds.includes(s.denialId))
      .map((s: any) => ({ id: s.denialId, label: s.denialDesc }))
  },
  {
    section: 'Withdrawal Symptoms',
    values: this.WithdSymptoms
      .filter((s: any) => physicalWsymptomsIds.includes(s.physicalWsymptomsId))
      .map((s: any) => ({ id: s.physicalWsymptomsId, label: s.physicalWsymptomsDesc }))
  },
  {
    section: 'Suspension of Activities',
    values: this.SuspenActivities
      .filter((s: any) => suspensionofActivitiesIds.includes(s.suspensionofActivitiesId))
      .map((s: any) => ({ id: s.suspensionofActivitiesId, label: s.suspensionofActivitiesDesc }))
  },
  {
    section: 'Cravings',
    values: this.Cravings
      .filter((s: any) => cravingsIds.includes(s.cravingsId))
      .map((s: any) => ({ id: s.cravingsId, label: s.cravingsDesc }))
  },
  {
    section: 'Other Observations',
    values: (otherObservations?.trim())
      ? [{ label: otherObservations.trim() }]
      : []
  },
  {
    section: 'Month Selected',
    values: (formattedMonth)
      ? [{ label: formattedMonth }]
      : []
  },
  
];

 const maxLength = Math.max(
    appearanceIds.length, sensoriumIds.length, functioningIds.length,
    speechIds.length, behaviorIds.length, moodAffectIds.length,
    dailyPatternsIds.length, thoughtContentIds.length, physicaIndicatorsIds.length,
    denialIds.length, physicalWsymptomsIds.length, suspensionofActivitiesIds.length,
    cravingsIds.length
  );

  this.listPatientMonthlyPReportToSave = [];

  // Use the value from the form if available, otherwise fallback to current date
  const dateSubmitted = dateSubmittedValue || new Date().toISOString();

  for (let i = 0; i < maxLength; i++) {
    this.listPatientMonthlyPReportToSave.push({
      recNo: 0,
      patientCode: patientCode,
      code: assessmentCode,
      appearanceId: appearanceIds[i] || 0,
      sensoriumId: sensoriumIds[i] || 0,
      functioningId: functioningIds[i] || 0,
      speechId: speechIds[i] || 0,
      behaviorId: behaviorIds[i] || 0,
      moodAffectId: moodAffectIds[i] || 0,
      dailyPatternsId: dailyPatternsIds[i] || 0,
      thoughtContentId: thoughtContentIds[i] || 0,
      physicalIndicatorsId: physicaIndicatorsIds[i] || 0,
      denialId: denialIds[i] || 0,
      physicalWsymptomsId: physicalWsymptomsIds[i] || 0,
      suspensionofActivitiesId: suspensionofActivitiesIds[i] || 0,
      cravingsId: cravingsIds[i] || 0,
      otherObservations: otherObservations?.trim() || '',
      dateSubmitted: dateSubmitted,
      notedBy: notedBy,     
       preparedBy: preparedBy

    });
  }

  console.log('Updated Monthly Report:', this.listPatientMonthlyPReport);
  console.log('To Save:', this.listPatientMonthlyPReportToSave);


  console.log('Updated Monthly Report:', this.listPatientMonthlyPReport);
}

 private formatDateLog = (datelog: string | null): string | null => {
  if (!datelog || !datelog.includes('-')) return null;
  const [year, month] = datelog.split('-').map(Number);
  const fullDate = new Date(Date.UTC(year, month - 1, 1));
  return fullDate.toISOString();
};


 goToSubstanceHisto(): void {
  this.showTab('#RehabProgress'); 
}
goToEvalSum(): void {
  this.showTab('#PsychologicalEvalSummary'); 
}
goToPlanSummary(): void {
  this.showTab('#PlanSummary'); 
}
  goToPsychologicalSummary(): void {
  this.markFieldsAsTouched(this.physicalFields);

  const hasInvalid = this.physicalFields.some(field => {
    const control = this.MentalStatusForm.get(field);
    return !control?.touched || (control?.value?.length || 0) === 0;
  });

  if (hasInvalid) {
    return; 
  }

  this.showTab('#PsychologicalSummary');
}

 markFieldsAsTouched(fields: string[]): void {
  fields.forEach(field => {
    const control = this.MentalStatusForm.get(field);
    if (control) {
      control.markAsTouched();
    }
  });
}


requireAtLeastOnePerFieldValidator(formGroup: FormGroup): ValidationErrors | null {
   const requiredFields = [
    'appearanceId',
    'sensoriumId',
    'functioningId',
    'speechId',
    'behaviorId',
    'moodAffectId',
    'dailyPatternsId',
    'thoughtContentId',
    'otherObservations',
    'dateSubmitted',
    'notedBy',
    'preparedBy'
  ];

  const invalidFields: string[] = [];

  for (const field of requiredFields) {
    const value = formGroup.get(field)?.value;
    if (!Array.isArray(value) || value.length === 0) {
      invalidFields.push(field);
    }
  }

  if (invalidFields.length > 0) {
    // Build an error object like: { appearanceId: true, speechId: true }
    const errors: ValidationErrors = {};
    invalidFields.forEach(field => {
      errors[field] = true;
    });
    return errors;
  }

  return null; // All good

}
  requireAtLeastOnePhysicalValidator(formGroup: FormGroup): ValidationErrors | null {
    const requiredFields = [
      'physicaIndicatorsId',
      'denialId',
      'physicalWsymptomsId',
      'suspensionofActivitiesId',
      'cravingsId',
      'notedBy',
     'preparedBy'
    ];

    const errors: any = {};

    for (const field of requiredFields) {
      const value = formGroup.get(field)?.value;
      if (!value || value.length === 0) {
        errors[field] = true;
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
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

////Printing Functions
printSWPN(recNo: string): void {
  console.log('Printing for:', recNo);
  // TODO: implement print logic here
}
printNurses(recNo: string): void {
  console.log('Printing for:', recNo);
  // TODO: implement print logic here
}
printMPPR(recNo: string): void {
  console.log('Printing for:', recNo);
  // TODO: implement print logic here
}
printPsychEVal(recNo: string): void {
  console.log('Printing for:', recNo);
  // TODO: implement print logic here
}
printTreatPlan(recNo: string): void {
  console.log('Printing for:', recNo);
  // TODO: implement print logic here
}
printDocOrder(recNo: string): void {
  console.log('Printing for:', recNo);
  // TODO: implement print logic here
}
printMedication(recNo: string): void {
  console.log('Printing for:', recNo);
  // TODO: implement print logic here
}

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
