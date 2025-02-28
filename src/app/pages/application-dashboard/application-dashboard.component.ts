
import { PatientFormService } from './../../pages/application-dashboard/ScriptForms/patient-form.service';
import { Component, inject, OnInit } from '@angular/core';
import { ApplicationDashboardService } from './service/application-dashboard.service';
import { AuthService } from '../../Admin/Auth/AuthService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SchoolFormService } from './ScriptForms/school-form.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-application-dashboard',
  templateUrl: './application-dashboard.component.html',
  styleUrls: ['./application-dashboard.component.css'],
})
export class ApplicationDashboardComponent {


  patientForm!: FormGroup;
  patientSchoolForm!: FormGroup;

  ExistedPatient: any = [];
  ExistedPatientSchool: any = [];

  userInfo: any;

  admissionType: any = [];
  selectedAdmissionType: any[]= [];
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
    private service: ApplicationDashboardService,
    private schoolFormService:SchoolFormService) {}




  ngOnInit(): void {

    this.userInfo = this.authService.getUserInfo();


   this.ChckExisted();


    this.fetchAdditionalData();

  } //end of ngOnInit

ChckExisted(): void {
  this.route.paramMap.subscribe((params) => {
    const patientCode = params.get('patientCode');
    if (patientCode) {
      //console.log('Selected Patient Code:', patientCode);
      this.ExistedPatientCode = patientCode;

    this.ExistedPatientData(patientCode);
    this.ExistedPatientSchoolData(patientCode);
    } else {
      this.patientForm = this.patientFormService.createPatientForm(this.userInfo);
      this.patientSchoolForm = this.schoolFormService.createPatientSchoolForm(this.ExistedPatientCode);
    }
  });
}
ExistedPatientData(patientCode: string): void {
  this.service.getExistedPatientData(patientCode).subscribe({
    next: (response) => {
      this.ExistedPatient = response;
     console.log('ExistedPatient:', this.ExistedPatient);
      if (this.ExistedPatient.length > 0) {
        const formattedBirthDate = formatDate(this.ExistedPatient[0].birthdate, 'yyyy-dd-MM', 'en');
        this.ExistedPatient[0].birthdate = formattedBirthDate;
        this.patientForm = this.patientFormService.createPatientForm(this.userInfo, this.ExistedPatient[0]);

        this.service.getBrgy(this.ExistedPatient[0].citymunCode).subscribe({
          next: (response) => {
            this.brgy = response;
         //   console.log('brgy:', this.brgy);
          },
          error: (error) => {
            console.error('Error:', error);
          },
        });
        this.service.getprk(this.ExistedPatient[0].brgyCode).subscribe({
          next: (response) => {
            this.prk = response;
            //console.log('brgy:', this.prk);
          },
          error: (error) => {
            console.error('Error:', error);
          },
        });

      } else {
        this.patientForm = this.patientFormService.createPatientForm(this.userInfo);
      }
    },
    error: (error) => {
      console.error('Error:', error);
      this.patientForm = this.patientFormService.createPatientForm(this.userInfo);
    },
  });
}
ExistedPatientSchoolData(patientCode: string): void {
     //getExistedPatientSchoolData
     this.service.getExistedPatientSchoolData(patientCode).subscribe({
      next: (response) => {
        this.ExistedPatientSchool = response;
        console.log('ExistedPatientSchool:', this.ExistedPatientSchool);
        if (this.ExistedPatientSchool.length > 0) {
          const formattedDateElemYear = formatDate(this.ExistedPatientSchool[0].patientElementaryYear, 'yyyy-MM-dd', 'en');
          const formattedDateHighSchoolYear = formatDate(this.ExistedPatientSchool[0].patientHighSchoolYear, 'yyyy-MM-dd', 'en');
          this.ExistedPatientSchool[0].patientElementaryYear = formattedDateElemYear;
          this.ExistedPatientSchool[0].patientHighSchoolYear = formattedDateHighSchoolYear;
          this.patientSchoolForm = this.schoolFormService.createPatientSchoolForm(this.ExistedPatientCode, this.ExistedPatientSchool[0]);
        }
        else {
          this.patientSchoolForm = this.schoolFormService.createPatientSchoolForm(this.ExistedPatientCode);
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.patientSchoolForm = this.schoolFormService.createPatientSchoolForm(this.ExistedPatientSchool[0]);
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
///FORMS SUBMIT
  patientFormSubmit(): void {
    this.patientFormService.submitPatientForm(this.patientForm);
}
patientSchoolFormSubmit(): void {
  this.schoolFormService.submitPatientSchoolForm(this.patientSchoolForm);
}

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
    if(this.ExistedPatient.length > 0){
      this.onChangeCitymunCode = this.ExistedPatient[0].citymunCode;
      this.service.getBrgy(this.onChangeCitymunCode).subscribe({
        next: (response) => {
          this.brgy = response;
          console.log('brgy:', this.brgy);
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
    }
    const selectElement = event.target as HTMLSelectElement;
    this.onChangeCitymunCode = selectElement.value;
    console.log('Municipality changed to:', selectElement.value);
    this.service.getBrgy(this.onChangeCitymunCode).subscribe({
      next: (response) => {
        this.brgy = response;
        console.log('brgy:', this.brgy);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  } //end of onMunicipalityChange
  onBarangayChange(event: Event): void {
    if(this.ExistedPatient.length > 0){
      this.onChangeBarangay = this.ExistedPatient[0].brgyCode;
      this.service.getprk(this.onChangeBarangay).subscribe({
        next: (response) => {
          this.prk = response;
          console.log('prk:', this.prk);
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
    }
    const selectElement = event.target as HTMLSelectElement;
    this.onChangeBarangay = selectElement.value;

    console.log('Brgy changed to:', selectElement.value);

    this.service.getprk(this.onChangeBarangay).subscribe({
      next: (response) => {
        this.prk = response;
        console.log('prk:', this.prk);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  } //end of onBarangayChange

  siblings: any[] = [
    {
      name: '',
      age: '',
      sex: '',
      civilStatus: '',
      occupation: '',
      education: '',
    },
  ];

  siblingsaddRow() {
    this.siblings.push({
      name: '',
      age: '',
      sex: '',
      civilStatus: '',
      occupation: '',
      education: '',
    });
  }

  childrens: any[] = [
    {
      name: '',
      age: '',
      sex: '',
      civilStatus: '',
      occupation: '',
      education: '',
    },
  ];

  childrensaddRow() {
    this.childrens.push({
      name: '',
      age: '',
      sex: '',
      civilStatus: '',
      occupation: '',
      education: '',
    });
  }
  employments: any[] = [{ epd: '', nca: '', addr: '', pos: '' }];
  employmentsaddRow() {
    this.employments.push({ epd: '', nca: '', addr: '', pos: '' });
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
  goToSubstanceHisto(): void {
    const subHistoTab = document.querySelector('[data-bs-target="#SubstanceHisto"]');
    if (subHistoTab) {
      const tabInstance = new (window as any).bootstrap.Tab(subHistoTab);
      tabInstance.show();
    }
  }
  goToEducational(): void {
    const subEducTab = document.querySelector('[data-bs-target="#EducationalAttain"]');
    if (subEducTab) {
      const EductabInstance = new (window as any).bootstrap.Tab(subEducTab);
      EductabInstance.show();
    }
  }
  goToFamHisto(): void {
    const subFamHisto = document.querySelector('[data-bs-target="#FamHistory"]');
    if (subFamHisto) {
      const FamtabInstance = new (window as any).bootstrap.Tab(subFamHisto);
      FamtabInstance.show();
    }
  }
  goToEmploy(): void {
    const subEmploy = document.querySelector('[data-bs-target="#EmployHisto"]');
    if (subEmploy) {
      const EmploytabInstance = new (window as any).bootstrap.Tab(subEmploy);
      EmploytabInstance.show();
    }
  }
  gotoAppHisto(): void {
    const subAppHisto = document.querySelector('[data-bs-target="#ApplicationHisto"]');
    if (subAppHisto) {
      const ApptabInstance = new (window as any).bootstrap.Tab(subAppHisto);
      ApptabInstance.show();
    }
  }
  goToPatientDashboard() {
    this.router.navigate(['/patientDashboard']);
  }
  goToSelectedApp(patientCode: string): void {
    this.router.navigate(['/application', patientCode]).then(() => {
      alert(`Selected Patient Code: ${patientCode}`);
    });
}
}


