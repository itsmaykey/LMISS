import { PatientFormService } from './ScriptForms/patient-form/patient-form.service';
import { Component, OnInit } from '@angular/core';
import { ApplicationDashboardService } from './service/application-dashboard.service';
import { AuthService } from '../../Admin/Auth/AuthService';
import { Form, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SchoolFormService } from './ScriptForms/patient-SchoolForm/school-form.service';
import { PatientParentFormService } from './ScriptForms/patient-ParentForm/patient-parent-form.service';
import { formatDate } from '@angular/common';
import { PatientSpouseFormService } from './ScriptForms/patient-SpouseForm/patient-spouse-form.service';
import { SiblingsFormService } from './ScriptForms/patient-SiblingForm/siblings-form.service';
import { ChildrensFormService } from './ScriptForms/patient-childrenForm/childrens-form.service';
import { EmploymentFormService } from './ScriptForms/patientEmploymentForm/employment-form.service';
@Component({
  selector: 'app-application-dashboard',
  templateUrl: './application-dashboard.component.html',
  styleUrls: ['./application-dashboard.component.css'],
})
export class ApplicationDashboardComponent implements OnInit {
  patientParentForm!: FormGroup;
  patientForm!: FormGroup;
  patientSchoolForm!: FormGroup;
  patientSpouseForm!: FormGroup;
  patientSiblingsForm!: FormGroup;
  patientEmploymentForm!: FormGroup;
  patientChildrenForm!: FormGroup;
  //siblings!: FormArray;

  ExistedPatient: any = [];
  ExistedPatientSchool: any = [];
  ExistedPatientParent: any = [];
  ExistedPatientSpouse: any = [];
  ExistedPatientSibling: any = [];
  ExistedPatientChildren: any = [];
  ExistedPatientEmployee: any = [];
  userInfo: any;

  admissionType: any = [];
  selectedAdmissionType: any[] = [];
  citymun: any = [];
  brgy: any = [];
  prk: any = [];
  nationality: any = [];
  civilStatus: any = [];
  religion: any = [];
  drugEffects: any = [];
  educationalAttainment: any = [];
  onChangeCitymunCode: string = '';
  onChangeBarangay: string = '';
  selectedDrugEffects: any[] = [];
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
    private employeeFormService: EmploymentFormService
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
  }

  initializeForms(): void {
    this.patientForm = this.patientFormService.createPatientForm(this.userInfo);
    this.patientSchoolForm = this.schoolFormService.createPatientSchoolForm(this.ExistedPatientCode);
    this.patientParentForm = this.patientParentFormService.createPatientParentForm(this.ExistedPatientCode);
    this.patientSpouseForm = this.patientSpouseFormService.createPatientSpouseForm(this.ExistedPatientCode);
    this.patientSiblingsForm = this.siblingsFormService.createPatientSiblingForm(this.ExistedPatientCode);
    this.patientEmploymentForm = this.employeeFormService.createPatientEmployeeForm(this.ExistedPatientCode);
    this.patientChildrenForm = this.childrenFormService.createPatientChildrenForm(this.ExistedPatientCode);
    // this.siblings = this.patientSiblingsForm.get('siblings') as FormArray;
  }


  loadExistedPatient(patientCode: string): void {
    this.service.getExistedPatientData(patientCode).subscribe({
      next: (response) => {
        this.ExistedPatient = response;
        if (this.ExistedPatient.length > 0) {
          const birthDateValue = new Date(this.ExistedPatient[0].birthdate);
          if (!isNaN(birthDateValue.getTime())) {
            this.ExistedPatient[0].birthdate = birthDateValue.toISOString().split('T')[0];
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
            this.patientEmploymentForm = this.employeeFormService.createPatientEmployeeForm(this.ExistedPatientCode, this.ExistedPatientEmployee[0]);
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

  patientSpouseFormSubmit(): void {
    this.patientSpouseFormService.submitPatientSpouseForm(this.patientSpouseForm);
  }

  patientSiblingsFormSubmit(): void {
    console.log(this.patientParentForm.valid);
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

  addSibling(): void {
    this.siblings.push(this.siblingsFormService.createSiblingFormGroup());
  }

  removeSibling(index: number): void {
    this.siblings.removeAt(index);
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


  // Event handlers
  onAdmissionTypeCheckboxChange(event: Event, admissionType: any): void {
    const checkbox = event.target as HTMLInputElement;
    admissionType.selected = checkbox.checked;

    if (checkbox.checked) {
      this.selectedAdmissionType.push(admissionType);
    } else {
      const index = this.selectedAdmissionType.findIndex(
        (effect) => effect.admissionCode === admissionType.admissionCode
      );
      if (index > -1) {
        this.selectedAdmissionType.splice(index, 1);
      }
    }

    console.log('Selected Admission Type:', this.selectedAdmissionType);
  }

  onCheckboxChange(event: Event, drugEffect: any): void {
    const checkbox = event.target as HTMLInputElement;
    drugEffect.selected = checkbox.checked;

    if (checkbox.checked) {
      this.selectedDrugEffects.push(drugEffect);
    } else {
      const index = this.selectedDrugEffects.findIndex(
        (effect) => effect.drugEffectCode === drugEffect.drugEffectCode
      );
      if (index > -1) {
        this.selectedDrugEffects.splice(index, 1);
      }
    }

    console.log('Selected Drug Effects:', this.selectedDrugEffects);
  }

  onMunicipalityChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.onChangeCitymunCode = selectElement.value;

    console.log('Municipality changed to:', this.onChangeCitymunCode);

    if (this.ExistedPatient.length > 0 && this.ExistedPatient[0].citymunCode) {
      this.onChangeCitymunCode = this.ExistedPatient[0].citymunCode;
    }

    this.service.getBrgy(this.onChangeCitymunCode).subscribe({
      next: (response) => {
        this.brgy = response;
        console.log('Barangays:', this.brgy);
      },
      error: (error) => {
        console.error('Error fetching barangays:', error);
      },
    });
  }

  onBarangayChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.onChangeBarangay = selectElement.value;

    console.log('Barangay changed to:', this.onChangeBarangay);

    if (this.ExistedPatient.length > 0 && this.ExistedPatient[0].brgyCode) {
      this.onChangeBarangay = this.ExistedPatient[0].brgyCode;
    }

    this.service.getprk(this.onChangeBarangay).subscribe({
      next: (response) => {
        this.prk = response;
        console.log('Puroks:', this.prk);
      },
      error: (error) => {
        console.error('Error fetching puroks:', error);
      },
    });
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

  goToSelectedApp(patientCode: string): void {
    this.router.navigate(['/application', patientCode]).then(() => {
      alert(`Selected Patient Code: ${patientCode}`);
    });
  }

  private showTab(selector: string): void {
    const tabElement = document.querySelector(`[data-bs-target="${selector}"]`);
    if (tabElement) {
      const tabInstance = new (window as any).bootstrap.Tab(tabElement);
      tabInstance.show();
    }
  }


 
  drugHistories: any[] = [{ dc: '', ds: '', lu: '', udq: '', hd: '' }];
  drughistoriessaddRow() {
    this.drugHistories.push({ dc: '', ds: '', lu: '', udq: '', hd: '' });
  }

  PrevRehab: any[] = [{ pr: '', rc: '', whe: '' }];
  PrevRehabaddRow() {
    this.PrevRehab.push({ pr: '', rc: '', whe: '' });
  }
  FamHealthHistories: any[] = [
    { n: '', bp: '', h: '', w: '', rr: '', cr: '', tms: '' },
  ];
  FamHealthHistoriesaddRow() {
    this.FamHealthHistories.push({
      n: '',
      bp: '',
      h: '',
      w: '',
      rr: '',
      cr: '',
      tms: '',
    });
  }
}
