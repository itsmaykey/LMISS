import { PatientFormService } from './ScriptForms/patient-form/patient-form.service';
import { Component, OnInit } from '@angular/core';
import { ApplicationDashboardService } from './service/application-dashboard.service';
import { AuthService } from '../../Admin/Auth/AuthService';
import { Form, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SchoolFormService } from './ScriptForms/patient-SchoolForm/school-form.service';
import { PatientParentFormService } from './ScriptForms/patient-ParentForm/patient-parent-form.service';
import { formatDate } from '@angular/common';
import { PatientSpouseFormService } from './ScriptForms/patient-SpouseForm/patient-spouse-form.service';
import { SiblingsFormService } from './ScriptForms/patient-SiblingForm/siblings-form.service';
import { ChildrensFormService } from './ScriptForms/patient-childrenForm/childrens-form.service';
import { EmploymentFormService } from './ScriptForms/patientEmploymentForm/employment-form.service';
import { PatientDrugHistoryService } from './ScriptForms/patient-drugHistory/patient-drug-history.service';
import { PatientDrugReasonService } from './ScriptForms/patientDrugReason/patient-drug-reason.service';
import { PatientDrugEffectService } from './ScriptForms/patientDrugEffect/patient-drug-effect.service';
import { PatientHealthHistoryService } from './ScriptForms/patientHealthHistory/patient-health-history.service';
import { PatientRehabRecordService } from './ScriptForms/PatientRehabRecord/patient-rehab-record.service';
import { PatientFamHealthService } from './ScriptForms/patientFamHealth/patient-fam-health.service';
import { PatientStaffAssessmentService } from './ScriptForms/patientStaffAssessment/patient-staff-assessment.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-application-dashboard',
  templateUrl: './application-dashboard.component.html',
  styleUrls: ['./application-dashboard.component.css'],
})
export class ApplicationDashboardComponent implements OnInit {
    isSubmitting: boolean = false;
  patientParentForm!: FormGroup;
  patientForm!: FormGroup;
  patientSchoolForm!: FormGroup;
  patientSpouseForm!: FormGroup;
  patientSiblingsForm!: FormGroup;
  patientEmploymentForm!: FormGroup;
  patientChildrenForm!: FormGroup;
  patientDrugHistoryForm!: FormGroup;
  patientDrugReasonForm!: FormGroup;
  patientDrugEffectForm!: FormGroup;
  patientPersonalHealthForm!: FormGroup;
  patientRehabRecordForm!: FormGroup;
  FamHealthHistoryForm!: FormGroup;
  AssessmentForm!: FormGroup;
  //siblings!: FormArray;
  ExistedPatient: any = [];
  ExistedPatientSchool: any = [];
  ExistedPatientParent: any = [];
  ExistedPatientSpouse: any = [];
  ExistedPatientSibling: any = [];
  ExistedPatientChildren: any = [];
  ExistedPatientEmployee: any = [];
  ExistedPatientDrugHistory: any = [];
  ExistedPatientDrugReason: any = [];
  ExistedPatientDrugEffect: any = [];
  ExistedPatientHealthHistory: any = [];
  ExistedPatientRehabRecord: any = [];
  ExistedPatientFamHealth: any = [];
  ExistedPatientAssessment: any = [];
  userInfo: any;

  admissionType: any = [];
  selectedAdmissionType: any[] = [];
  citymun: any = [];
  brgy: any = [];
  prk: any = [];
  nationality: any = [];
  civilStatus: any = [];
  dSubstance: any = [];
  religion: any = [];
  drugEffects: any = [];
  educationalAttainment: any = [];
  onChangeCitymunCode: string = '';
  onChangeBarangay: string = '';
  initialSelectedCodes: string[] = [];
  currentSelectedCodes: string[] = [];
  deselectedCodes: string[] = [];

  ExistedPatientCode = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private patientFormService: PatientFormService,
    private patientParentFormService: PatientParentFormService,
    private service: ApplicationDashboardService,
    private schoolFormService: SchoolFormService,
    private patientSpouseFormService: PatientSpouseFormService,
    private siblingsFormService: SiblingsFormService,
    private childrenFormService: ChildrensFormService,
    private employeeFormService: EmploymentFormService,
    private PatientDrugHistoryService: PatientDrugHistoryService,
    private PatientDrugReasonService: PatientDrugReasonService,
    private PatientDrugEffectService: PatientDrugEffectService,
    private PatientHealthHistoryService: PatientHealthHistoryService,
    private PatientRehabRecordService: PatientRehabRecordService,
    private PatientFamHealthService: PatientFamHealthService,
    private PatientStaffAssessmentService: PatientStaffAssessmentService,
  ) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    this.checkExisted();
    this.fetchAdditionalData();
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
    this.loadExistedPatient(patientCode);
    this.loadExistedPatientSchoolData(patientCode);
    this.loadExistedPatientParentData(patientCode);
    this.loadExistedPatientSpouseData(patientCode);
    this.loadExistedPatientSiblingsData(patientCode);
    this.loadExistedPatientChildrensData(patientCode);
    this.loadExistedPatientEmployeeData(patientCode);
    this.loadExistedPatientDrugHistoryData(patientCode);
    this.loadExistedPatientDrugReasonData(patientCode);
    this.loadExistedPatientDrugEffectData(patientCode);
    this.loadExistedPatientHealthHistoryData(patientCode);
    this.loadExistedPatientRehabRecordData(patientCode);
    this.loadExistedPatientFamHealthData(patientCode);
    this.loadExistedPatientAssessmentData(patientCode);
  }

  initializeForms(): void {
    this.patientForm = this.patientFormService.createPatientForm(this.userInfo);
    this.patientSchoolForm = this.schoolFormService.createPatientSchoolForm(this.ExistedPatientCode);
    this.patientParentForm = this.patientParentFormService.createPatientParentForm(this.ExistedPatientCode);
    this.patientSpouseForm = this.patientSpouseFormService.createPatientSpouseForm(this.ExistedPatientCode);
    this.patientSiblingsForm = this.siblingsFormService.createPatientSiblingForm(this.ExistedPatientCode);
    this.patientEmploymentForm = this.employeeFormService.createPatientEmployeeForm(this.ExistedPatientCode);
    this.patientChildrenForm = this.childrenFormService.createPatientChildrenForm(this.ExistedPatientCode);
    this.patientDrugHistoryForm = this.PatientDrugHistoryService.createPatientDrugHistoryForm(this.ExistedPatientCode);
    this.patientDrugReasonForm = this.PatientDrugReasonService.createPatientDrugReasonForm(this.ExistedPatientCode);
    this.patientDrugEffectForm = this.PatientDrugEffectService.createPatientDrugEffectForm(this.ExistedPatientCode);
    this.patientPersonalHealthForm = this.PatientHealthHistoryService.createPatientHealthHistoryForm(this.ExistedPatientCode);
    this.patientRehabRecordForm = this.PatientRehabRecordService.createPatientRehabRecordForm(this.ExistedPatientCode);
    this.FamHealthHistoryForm = this.PatientFamHealthService.createPatientFamHealthHistoryForm(this.ExistedPatientCode);
    this.AssessmentForm = this.PatientStaffAssessmentService.createStaffAssessmentForm(this.ExistedPatientCode);
    // this.siblings = this.patientSiblingsForm.get('siblings') as FormArray;
  }


  loadExistedPatient(patientCode: string): void {
    this.service.getExistedPatientData(patientCode).subscribe({
      next: (response) => {
        this.ExistedPatient = response;
        if (this.ExistedPatient.length > 0) {
          const birthDateValue = new Date(this.ExistedPatient[0].birthdate);
          if (!isNaN(birthDateValue.getTime())) {
            const yyyy = birthDateValue.getFullYear();
            const mm = String(birthDateValue.getMonth() + 1).padStart(2, '0');
            const dd = String(birthDateValue.getDate()).padStart(2, '0');
            this.ExistedPatient[0].birthdate = `${yyyy}-${mm}-${dd}`;
          }

          this.patientForm = this.patientFormService.createPatientForm(this.userInfo, this.ExistedPatient[0]);
          this.loadBrgyAndPrk(this.ExistedPatient[0].citymunCode, this.ExistedPatient[0].brgyCode);
        } else {
          this.patientForm = this.patientFormService.createPatientForm(this.userInfo);
        }
      },
      error: () => {
        this.patientForm = this.patientFormService.createPatientForm(this.userInfo);
      },
    });
  }

  loadBrgyAndPrk(citymunCode: string, brgyCode: string): void {
    this.service.getBrgy(citymunCode).subscribe({
      next: (response) => {
        this.brgy = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getprk(brgyCode).subscribe({
      next: (response) => {
        this.prk = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  loadExistedPatientSchoolData(patientCode: string): void {
    this.service.getExistedPatientSchoolData(patientCode).subscribe({
      next: (response) => {
        this.ExistedPatientSchool = response;
        if (this.ExistedPatientSchool.length > 0) {
          const formattedDateElemYear = formatDate(this.ExistedPatientSchool[0].patientElementaryYear, 'yyyy-MM-dd', 'en');
          const formattedDateHighSchoolYear = formatDate(this.ExistedPatientSchool[0].patientHighSchoolYear, 'yyyy-MM-dd', 'en');
          this.ExistedPatientSchool[0].patientElementaryYear = formattedDateElemYear;
          this.ExistedPatientSchool[0].patientHighSchoolYear = formattedDateHighSchoolYear;
          this.patientSchoolForm = this.schoolFormService.createPatientSchoolForm(this.ExistedPatientCode, this.ExistedPatientSchool[0]);
        } else {
          this.patientSchoolForm = this.schoolFormService.createPatientSchoolForm(this.ExistedPatientCode);
        }
      },
      error: () => {
        this.patientSchoolForm = this.schoolFormService.createPatientSchoolForm(this.ExistedPatientSchool[0]);
      },
    });
  }

  loadExistedPatientParentData(patientCode: string): void {
    this.service.getExistedPatientParentData(patientCode).subscribe({
      next: (response) => {
        this.ExistedPatientParent = response;
        if (this.ExistedPatientParent.length > 0) {
          this.patientParentForm = this.patientParentFormService.createPatientParentForm(this.ExistedPatientCode, this.ExistedPatientParent[0]);
        } else {
          this.patientParentForm = this.patientParentFormService.createPatientParentForm(this.ExistedPatientCode);
        }
      },
      error: () => {
        this.patientParentForm = this.patientParentFormService.createPatientParentForm(this.ExistedPatientParent[0]);
      },
    });
  }

  loadExistedPatientSpouseData(patientCode: string): void {
    this.service.getExistedPatientSpouseData(patientCode).subscribe({
      next: (response) => {
        this.ExistedPatientSpouse = response;
        if (this.ExistedPatientSpouse.length > 0) {
          this.patientSpouseForm = this.patientSpouseFormService.createPatientSpouseForm(this.ExistedPatientCode, this.ExistedPatientSpouse[0]);
        } else {
          this.patientSpouseForm = this.patientSpouseFormService.createPatientSpouseForm(this.ExistedPatientCode);
        }
      },
      error: () => {
        this.patientSpouseForm = this.patientSpouseFormService.createPatientSpouseForm(this.ExistedPatientSpouse[0]);
      },
    });
  }

  loadExistedPatientSiblingsData(patientCode: string): void {
    this.service.getExistedPatientSiblingData(patientCode).subscribe({
      next: (response) => {
        this.ExistedPatientSibling = response;
        console.log(this.ExistedPatientSibling);
        if (this.ExistedPatientSibling.length > 0) {
          this.ExistedPatientSibling.forEach((sibling: any) => {
            const birthDateValue = new Date(sibling.siblingBirthDate);
            if (!isNaN(birthDateValue.getTime())) {
              sibling.siblingBirthDate = birthDateValue.toISOString().split('T')[0];
            }
          });
          this.patientSiblingsForm = this.siblingsFormService.createPatientSiblingForm(this.ExistedPatientCode, { siblings: this.ExistedPatientSibling });
        } else {
          this.patientSiblingsForm = this.siblingsFormService.createPatientSiblingForm(this.ExistedPatientCode);
        }
      },
      error: () => {
        this.patientSiblingsForm = this.siblingsFormService.createPatientSiblingForm(this.ExistedPatientCode);
      },
    });
  }
  loadExistedPatientChildrensData(patientCode: string): void {
    this.service.getExistedPatientChildrenData(patientCode).subscribe({
      next: (response) => {
        this.ExistedPatientChildren = response;
        console.log(this.ExistedPatientChildren);
        if (this.ExistedPatientChildren.length > 0) {
          this.ExistedPatientChildren.forEach((children: any) => {
            const birthDateValue = new Date(children.childBirthDate);
            if (!isNaN(birthDateValue.getTime())) {
              children.childBirthDate = birthDateValue.toISOString().split('T')[0];
            }
          });
          this.patientChildrenForm = this.childrenFormService.createPatientChildrenForm(this.ExistedPatientCode, { childrens: this.ExistedPatientChildren });
        } else {
          this.patientChildrenForm = this.childrenFormService.createPatientChildrenForm(this.ExistedPatientCode);
        }
      },
      error: () => {
        this.patientChildrenForm = this.childrenFormService.createPatientChildrenForm(this.ExistedPatientCode);
      },
    });
  }
  loadExistedPatientEmployeeData(patientCode: string): void {
    this.service.getExistedPatientEmploymentData(patientCode).subscribe({
      next: (response) => {
        this.ExistedPatientEmployee = response;
        console.log(this.ExistedPatientEmployee);
        if (this.ExistedPatientEmployee.length > 0) {
            this.patientEmploymentForm = this.employeeFormService.createPatientEmployeeForm(this.ExistedPatientCode, {employs: this.ExistedPatientEmployee});
          } else {
            this.patientEmploymentForm = this.employeeFormService.createPatientEmployeeForm(this.ExistedPatientCode);
          }
      },
      error: (error) => {
        console.error('Error loading Existed Patient Employee Data:', error);
        this.patientEmploymentForm = this.employeeFormService.createPatientEmployeeForm(this.ExistedPatientCode);
      },
    });
  }
  loadExistedPatientRehabRecordData(patientCode: string): void {
    this.service.getExistedPatientRehabilitationRecordData(patientCode).subscribe({
      next: (response) => {
        this.ExistedPatientRehabRecord = response;
        console.log('Fetched rehab record:', this.ExistedPatientRehabRecord);

        // Confirm the data is an array and has expected structure
        if (Array.isArray(this.ExistedPatientRehabRecord) && this.ExistedPatientRehabRecord.length > 0) {
          console.log('Populating form with rehab data...');
          this.patientRehabRecordForm = this.PatientRehabRecordService.createPatientRehabRecordForm(
            this.ExistedPatientCode,
            { rehabRecords: this.ExistedPatientRehabRecord }
          );
        } else {
          console.log('No rehab records found or data format incorrect. Initializing empty form...');
          this.patientRehabRecordForm = this.PatientRehabRecordService.createPatientRehabRecordForm(this.ExistedPatientCode);
        }
      },
      error: (error) => {
        console.error('Error loading Existed Patient Rehab Data:', error);
        this.patientRehabRecordForm = this.PatientRehabRecordService.createPatientRehabRecordForm(this.ExistedPatientCode);
      },
    });
  }


  loadExistedPatientDrugHistoryData(patientCode: string): void {
    this.service.getExistedPatientDrugHistoryData(patientCode).subscribe({
      next: (response) => {
        this.ExistedPatientDrugHistory = response;
        console.log(this.ExistedPatientDrugHistory);
        if (this.ExistedPatientDrugHistory.length === 0) {
          // Add a blank value if no data exists
          this.ExistedPatientDrugHistory.push({ dateStarted: '', latestUse: '', frequency: '' });
        }
        this.ExistedPatientDrugHistory.forEach((drugHistory: any) => {
          const dateStarted = new Date(drugHistory.dateStarted);
          const latestUse = new Date(drugHistory.latestUse);
          if (!isNaN(dateStarted.getTime())) {
            drugHistory.dateStarted = dateStarted.toISOString().split('T')[0];
          }
          if (!isNaN(latestUse.getTime())) {
            drugHistory.latestUse = latestUse.toISOString().split('T')[0];
          }
        });
        this.patientDrugHistoryForm = this.PatientDrugHistoryService.createPatientDrugHistoryForm(this.ExistedPatientCode, { drugHistorys: this.ExistedPatientDrugHistory });
      },
      error: () => {
        this.patientDrugHistoryForm = this.PatientDrugHistoryService.createPatientDrugHistoryForm(this.ExistedPatientCode, { drugHistorys: [{ dateStarted: '', latestUse: '', frequency: '' }] });
      },
    });
  }
  loadExistedPatientDrugEffectData(patientCode: string): void {
    forkJoin({
      drugEffects: this.service.getDrugEffect(),
      existingData: this.service.getExistedPatientDrugEffectData(patientCode)
    }).subscribe({
      next: ({ drugEffects, existingData }) => {
        const existingList = Array.isArray(existingData) ? existingData : [];
        console.log(existingList);
        const selectedCodes = existingList.map((item: any) => item.drugEffectCode);

        // Filter the drugEffects to include only those with drugEffectStatus == 1
        this.drugEffects = (drugEffects as any[])
          .filter((effect: any) => effect.drugEffectStatus === 1)  // Added filter here
          .map((effect: any) => ({
            ...effect,
            selected: selectedCodes.includes(effect.drugEffectCode)
          }));

        const firstRecord = existingList.length > 0 ? {
          ...existingList[0],
          drugEffectCode: selectedCodes
        } : {
          drugEffectCode: []
        };

        this.patientDrugEffectForm = this.PatientDrugEffectService.createPatientDrugEffectForm(patientCode, firstRecord);
      },
      error: (err) => {
        console.error('Error loading form data:', err);

        this.patientDrugEffectForm = this.PatientDrugEffectService.createPatientDrugEffectForm(patientCode);
      }
    });
  }

  loadExistedPatientAssessmentData(patientCode: string): void {
    forkJoin({
      admissionType: this.service.getAdmissionType(),
      existingData: this.service.getExistedPatientAssessmentData(patientCode)
    }).subscribe({
      next: ({ admissionType, existingData }) => {
        const existingList = Array.isArray(existingData) ? existingData : [];
        console.log(existingList);
        const selectedCodes = existingList.map((item: any) => item.admissionCode);

        this.admissionType = (admissionType as any[]).map((admission: any) => ({
          ...admission,
          selected: selectedCodes.includes(admission.admissionCode)
        }));


        const firstRecord = existingList.length > 0 ? {
          ...existingList[0],
          admissionCode: selectedCodes
        } : {
          admissionCode: []
        };

        this.AssessmentForm = this.PatientStaffAssessmentService.createStaffAssessmentForm(patientCode, firstRecord);
      },
      error: (err) => {
        console.error('Error loading form data:', err);

        this.AssessmentForm = this.PatientStaffAssessmentService.createStaffAssessmentForm(patientCode);
      }
    });
  }

  loadExistedPatientDrugReasonData(patientCode: string): void {
    this.service.getExistedPatientDrugReasonData(patientCode).subscribe({
      next: (response) => {
        this.ExistedPatientDrugReason = response;
        if (this.ExistedPatientDrugReason.length > 0) {

          this.patientDrugReasonForm = this.PatientDrugReasonService.createPatientDrugReasonForm(this.ExistedPatientCode, this.ExistedPatientDrugReason[0]);
        } else {
          this.patientDrugReasonForm = this.PatientDrugReasonService.createPatientDrugReasonForm(this.ExistedPatientCode);
        }
      },
      error: () => {
        this.patientDrugReasonForm = this.PatientDrugReasonService.createPatientDrugReasonForm(this.ExistedPatientDrugReason[0]);
      },
    });
  }
  loadExistedPatientHealthHistoryData(patientCode: string): void {
    this.service.getExistedPatientHealthHistoryData(patientCode).subscribe({
      next: (response) => {
        this.ExistedPatientHealthHistory = response;
        if (this.ExistedPatientHealthHistory.length > 0) {
          this.patientPersonalHealthForm = this.PatientHealthHistoryService.createPatientHealthHistoryForm(this.ExistedPatientCode, this.ExistedPatientHealthHistory[0]);
        } else {
          this.patientPersonalHealthForm = this.PatientHealthHistoryService.createPatientHealthHistoryForm(this.ExistedPatientCode);
        }
      },
      error: () => {
        this.patientPersonalHealthForm = this.PatientHealthHistoryService.createPatientHealthHistoryForm(this.ExistedPatientHealthHistory[0]);
      },
    });
  }
  loadExistedPatientFamHealthData(patientCode: string): void {
    this.service.getExistedPatientFamilyHealth(patientCode).subscribe({
      next: (response) => {
        this.ExistedPatientFamHealth = response;
        console.log(this.ExistedPatientFamHealth);
        if (this.ExistedPatientFamHealth.length > 0) {
            this.FamHealthHistoryForm = this.PatientFamHealthService.createPatientFamHealthHistoryForm(this.ExistedPatientCode, {famHealths: this.ExistedPatientFamHealth});
          } else {
            this.FamHealthHistoryForm = this.PatientFamHealthService.createPatientFamHealthHistoryForm(this.ExistedPatientCode);
          }
      },
      error: (error) => {
        console.error('Error loading Existed Patient Family Health Data:', error);
        this.FamHealthHistoryForm = this.PatientFamHealthService.createPatientFamHealthHistoryForm(this.ExistedPatientCode);
      },
    });
  }

  fetchAdditionalData(): void {
    this.service.getDrugEffect().subscribe({
      next: (response) => {
        this.drugEffects = (response as any[]).map((effect) => ({
          ...effect,
          selected: false,
        }));
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });

    this.service.getAdmissionType().subscribe({
      next: (response) => {
        this.admissionType = (response as any[]).map((effect) => ({
          ...effect,
          selected: false,
        }));
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });

    this.service.getEducationalAttainment().subscribe({
      next: (response) => {
        this.educationalAttainment = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });

    this.service.getReligion().subscribe({
      next: (response) => {
        this.religion = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });

    this.service.getCivilStats().subscribe({
      next: (response) => {
        this.civilStatus = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getDrugSubstance().subscribe({
      next: (response) => {
        this.dSubstance = response;
        console.log(this.dSubstance);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    this.service.getNationality().subscribe({
      next: (response) => {
        this.nationality = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });

    this.service.getCitymun().subscribe({
      next: (response) => {
        this.citymun = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  // Form submission methods
  patientFormSubmit(): void {
    this.patientFormService.submitPatientForm(this.patientForm);
  }

  patientParentFormSubmit(): void {
    this.patientParentFormService.submitPatientParentForm(this.patientParentForm);
  }

  patientSchoolFormSubmit(): void {
    this.schoolFormService.submitPatientSchoolForm(this.patientSchoolForm);
  }

  patientPersonalHealthFormSubmit(): void {
    console.log(this.patientPersonalHealthForm);
    this.PatientHealthHistoryService.submitPatientHealthHistoryForm(this.patientPersonalHealthForm);
  }
  patientSpouseFormSubmit(): void {
    this.patientSpouseFormService.submitPatientSpouseForm(this.patientSpouseForm);
  }
  patientDrugReasonFormSubmit(): void {
    this.PatientDrugReasonService.submitPatientDrugReasonForm(this.patientDrugReasonForm);
  }
  patientDrugEffectFormSubmit(): void {
    this.PatientDrugEffectService.submitPatientDrugEffectForm(this.patientDrugEffectForm);
  }
  AssessmentFormSubmit(): void {
    this.PatientStaffAssessmentService.submitAssessmentForm(this.AssessmentForm);
  }
  patientSiblingsFormSubmit(): void {
    if (this.patientSiblingsForm.value) {

      this.siblingsFormService.submitPatientSiblingForm(this.patientSiblingsForm.value).subscribe({
        next: (response) => {
          console.log('Patient Sibling Form submitted successfully:', response);

        },
        error: (error) => {
          console.error('Error submitting Patient Sibling Form:', error);

        },
      });
    } else {
      console.error('Patient Sibling Form is invalid');
    }
  }
  get siblings(): FormArray {
    return this.patientSiblingsForm.get('siblings') as FormArray;
  }
  removeSibling(index: number): void {
    console.log(this.ExistedPatientCode);
    console.log(this.siblings.value[index].siblingCode)
    this.service.removeSiblings(this.ExistedPatientCode, this.siblings.value[index].siblingCode).subscribe({
      next: (response) => {
        console.log(this.siblings.value[index].siblingName)
        Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: `Sibling deleted successfully. \n`+ this.siblings.value[index].siblingName,
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                  }).then(() => {
                    this.siblings.removeAt(index);
                  });

      },
      error: (error) => {
        console.error('Error deleting sibling:', error);
      },
    });


  }
  addSibling(): void {
    this.siblings.push(this.siblingsFormService.createSiblingFormGroup());
  }
  patientDrugHistoryFormSumit(): void {
    if (this.patientDrugHistoryForm.value) {

      this.PatientDrugHistoryService.submitPatientDrugHistoryForm(this.patientDrugHistoryForm.value).subscribe({
        next: (response: any) => {
          console.log('Patient drug history Form submitted successfully:', response);
        },
        error: (error: any) => {
          console.error('Error submitting Patient children Form:', error);
        },
      });
    } else {
      console.error('Patient children Form is invalid');
    }
  }
  drughistoriessaddRow(): void {
    this.drugHistorys.push(this.PatientDrugHistoryService.createDrugHistoryFormGroup());
  }

  get drugHistorys(): FormArray {
    return this.patientDrugHistoryForm.get('drugHistorys') as FormArray;
  }



  patientChildrenFormSubmit(): void {

    if (this.patientChildrenForm.value) {

      this.childrenFormService.submitPatientChildrenForm(this.patientChildrenForm.value).subscribe({
        next: (response) => {
          console.log('Patient children Form submitted successfully:', response);
        },
        error: (error) => {
          console.error('Error submitting Patient children Form:', error);
        },
      });
    } else {
      console.error('Patient children Form is invalid');
    }
  }
  get childrens(): FormArray {
    return this.patientChildrenForm.get('childrens') as FormArray;
  }

  addchildren(): void {
    this.childrens.push(this.childrenFormService.createChildrenFormGroup());
  }

  removechildren(index: number): void {
    this.childrens.removeAt(index);
  }

  patientEmployeeFormSubmit(): void {
  if (this.patientEmploymentForm.valid) { // ✅ Check if form is valid
    console.log("Form Data:", this.patientEmploymentForm.value); // ✅ Debugging

    this.employeeFormService.submitPatientEmployeeForm(this.patientEmploymentForm.value).subscribe({
      next: (response) => {
        console.log('Patient employee Form submitted successfully:', response);
      },
      error: (error) => {
        console.error('Error submitting Patient employee Form:', error);
      },
    });
  } else {
    console.error('Patient employee Form is invalid', this.patientEmploymentForm.errors); // ✅ Show validation errors
  }
}

  get employs(): FormArray {
    return this.patientEmploymentForm.get('employs') as FormArray;
  }

  employmentsaddRow(): void {
    this.employs.push(this.employeeFormService.createEmployeeFormGroup());
  }

  removeEmploy(index: number): void {
    this.employs.removeAt(index);
  }

  patientRehabRecordFormSubmit(): void {
    if (this.patientRehabRecordForm.valid) { // ✅ Check if form is valid
      console.log("Form Data:", this.patientRehabRecordForm.value); // ✅ Debugging

      this.PatientRehabRecordService.submitPatientRehabRecordForm(this.patientRehabRecordForm.value).subscribe({
        next: (response) => {
          console.log('Patient Rehab Form submitted successfully:', response);
        },
        error: (error) => {
          console.error('Error submitting Patient Rehab Form:', error);
        },
      });
    } else {
      console.error('Patient Rehab Form is invalid', this.patientRehabRecordForm.errors); // ✅ Show validation errors
    }
  }
  get rehabRecords(): FormArray {
    return this.patientRehabRecordForm.get('rehabRecords') as FormArray;
  }

  addRehabRecord(): void {
    this.rehabRecords.push(this.PatientRehabRecordService.createRehabRecordFormGroup());
  }
  patientFamHealthFormSubmit(): void {
    if (this.FamHealthHistoryForm.valid) { // ✅ Check if form is valid
      console.log("Form Data:", this.FamHealthHistoryForm.value); // ✅ Debugging

      this.PatientFamHealthService.submitPatientFamHealthForm(this.FamHealthHistoryForm.value).subscribe({
        next: (response) => {
          console.log('Patient Family Health Form submitted successfully:', response);
        },
        error: (error) => {
          console.error('Error submitting Patient Fam Health Form:', error);
        },
      });
    } else {
      console.error('Patient Family Health Form is invalid', this.FamHealthHistoryForm.errors); // ✅ Show validation errors
    }
  }

  get famHealths(): FormArray {
    return this.FamHealthHistoryForm.get('famHealths') as FormArray;
  }

  FamHealthHistoriesaddRow(): void {
    const newRow = this.PatientFamHealthService.createFamHealthFormGroup();
    newRow.patchValue({ isNew: true }); // ✅ Add a custom flag to mark this row as new
    this.famHealths.push(newRow);
  }

  // Event handlers
  // onAdmissionTypeCheckboxChange(event: Event, admissionType: any): void {
  //   const checkbox = event.target as HTMLInputElement;
  //   admissionType.selected = checkbox.checked;

  //   if (checkbox.checked) {
  //     this.selectedAdmissionType.push(admissionType);
  //   } else {
  //     const index = this.selectedAdmissionType.findIndex(
  //       (effect) => effect.admissionCode === admissionType.admissionCode
  //     );
  //     if (index > -1) {
  //       this.selectedAdmissionType.splice(index, 1);
  //     }
  //   }

  //   console.log('Selected Admission Type:', this.selectedAdmissionType);
  // }
  onAdmissionTypeCheckboxChange(event: any, item: any, form: FormGroup) {
    const admissionCodeArray = form.get('admissionCode') as FormArray;

    if (event.target.checked) {
      admissionCodeArray.push(new FormControl(item.admissionCode));
    } else {
      const index = admissionCodeArray.controls.findIndex(ctrl => ctrl.value === item.admissionCode);
      if (index >= 0) {
        admissionCodeArray.removeAt(index);
      }
    }
  }


  onCheckboxChange(event: any, item: any, form: FormGroup) {
    const drugEffectArray = form.get('drugEffectCode') as FormArray;
    const code = item.drugEffectCode;

    if (event.target.checked) {
      drugEffectArray.push(new FormControl(code));
      item.selected = true;

      // Add to currentSelectedCodes if not present
      if (!this.currentSelectedCodes.includes(code)) {
        this.currentSelectedCodes.push(code);
      }

      // Remove from deselected if it was there
      this.deselectedCodes = this.deselectedCodes.filter(c => c !== code);

    } else {
      const index = drugEffectArray.controls.findIndex(ctrl => ctrl.value === code);
      if (index >= 0) {
        drugEffectArray.removeAt(index);
      }
      item.selected = false;

      // Remove from currentSelectedCodes
      this.currentSelectedCodes = this.currentSelectedCodes.filter(c => c !== code);

      // Add to deselectedCodes if not present
      if (!this.deselectedCodes.includes(code)) {
        this.deselectedCodes.push(code);
      }
    }

    // 👇 Console the final result
    console.log('✅ Selected (excluding deselected):', this.currentSelectedCodes);
    console.log('❌ Deselected:', this.deselectedCodes);
  }




  onMunicipalityChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.onChangeCitymunCode = selectElement.value;

    console.log('Municipality changed to:', this.onChangeCitymunCode);

    if (this.onChangeCitymunCode) {
      this.service.getBrgy(this.onChangeCitymunCode).subscribe({
        next: (response) => {
          this.brgy = response;
          console.log('Barangays:', this.brgy);
        },
        error: (error) => {
          console.error('Error fetching barangays:', error);
        },
      });
    } else {
      console.warn('No city municipality code selected.');
    }
  }

  onBarangayChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    let selectedBarangay = selectElement.value;

    console.log('Barangay changed to:', selectedBarangay);

    // Fallback to ExistedPatient if no selection is made
    if (!selectedBarangay && this.ExistedPatient?.length > 0 && this.ExistedPatient[0].brgyCode) {
      selectedBarangay = this.ExistedPatient[0].brgyCode;
    }

    this.onChangeBarangay = selectedBarangay;

    if (this.onChangeBarangay) {
      this.service.getprk(this.onChangeBarangay).subscribe({
        next: (response) => {
          // Ensure response is an array of puroks
          this.prk = response;
          console.log('Puroks:', this.prk);
        },
        error: (error) => {
          console.error('Error fetching puroks:', error);
        },
      });
    } else {
      console.warn('No valid barangay selected. Skipping purok fetch.');
    }
  }



  // Navigation methods
  goToSubstanceHisto(): void {
    this.showTab('#SubstanceHisto');
  }

  goToEducational(): void {
    this.showTab('#EducationalAttain');
  }

  goToFamHisto(): void {
    this.showTab('#FamHistory');
  }

  goToChild(): void {
    this.showTab('#navChild');
  }

  goToSibs(): void {
    this.showTab('#navSiblings');
  }

  goToSpouse(): void {
    this.showTab('#navSpouse');
  }

  goToEmploy(): void {
    this.showTab('#EmployHisto');
  }

  gotoAppHisto(): void {
    this.showTab('#ApplicationHisto');
  }

  goToPatientDashboard(): void {
    this.router.navigate(['/patientDashboard']);
  }
  gotoNavReason(): void {
    this.showTab('#navReason');
  }
  gotoNavDrugEffects(): void {
    this.showTab('#navDrugEffects');
  }
  gotoNavRehabRecord(): void {
    this.showTab('#navRehabRecord');
  }
  gotoNavPersonalHealth(): void {
    this.showTab('#navPersonalHealth');
  }
  gotoNavFamilyHealth(): void {
    this.showTab('#navFamilyHealth');
  }
  goToSelectedApp(patientCode: string): void {
    this.router.navigate(['/application', patientCode]).then(() => {
      alert(`Selected Patient Code: ${patientCode}`);
    });


  }

  ////navSub

  private showTab(selector: string): void {
    const tabElement = document.querySelector(`[data-bs-target="${selector}"]`);
    if (tabElement) {
      const tabInstance = new (window as any).bootstrap.Tab(tabElement);
      tabInstance.show();
    }
  }

}
