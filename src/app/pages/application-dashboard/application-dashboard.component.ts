import { Component, inject, OnInit } from '@angular/core';
import { ApplicationDashboardService } from './service/application-dashboard.service';
import { AuthService } from '../../Admin/Auth/AuthService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-application-dashboard',
  templateUrl: './application-dashboard.component.html',
  styleUrls: ['./application-dashboard.component.css'],
})
export class ApplicationDashboardComponent {


  patientForm!: FormGroup;


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
  patientCode: string | null = null;

  

  constructor(private authService: AuthService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {}
  service = inject(ApplicationDashboardService);
  selectedDrugEffects: any[] = [];

  userInfo: any;


  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    console.log(this.userInfo);
    this.patientCode = this.route.snapshot.paramMap.get('patientCode') || '';

    // Show an alert only in ApplicationComponent
    if (this.patientCode) {
      alert(`Selected Patient Code: ${this.patientCode}`);
    }
    //Educational Attainment
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

    //Educational Attainment
    this.service.getEducationalAttainment().subscribe({
      next: (response) => {
        this.educationalAttainment = response;
        console.log('Educational Attainment:', this.educationalAttainment);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    //Religion
    this.service.getReligion().subscribe({
      next: (response) => {
        this.religion = response;
        console.log('Religion:', this.religion);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    //Civil Status
    this.service.getCivilStats().subscribe({
      next: (response) => {
        this.civilStatus = response;
        console.log('Civil Status:', this.civilStatus);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    //Nationality
    this.service.getNationality().subscribe({
      next: (response) => {
        this.nationality = response;
        console.log('Nationality:', this.nationality);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
    //Citymun
    this.service.getCitymun().subscribe({
      next: (response) => {
        this.citymun = response;
        console.log('citymun:', this.citymun);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });

    const customUUID = (): string => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let uuid = 'DDNPQR-';
      for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
       uuid += chars[randomIndex];
       this.patientCode = uuid;
      }
      return uuid

    }
    this.patientForm = this.fb.group({

      
      patientCode: [customUUID(), Validators.required] ,
      pFirstName: ['', Validators.required],
      pMiddleName: ['',],
      pLastName: ['', Validators.required],
      pExtName: ['',],
      pNickName: ['', Validators.required],
      sex: ['' , Validators.required],
      birthdate: ['', Validators.required],
      prkCode: ['', Validators.required],
      phoneNumber:['', Validators.required],
      birthplace: ['', Validators.required],
      nationalityId: ['', Validators.required],
      religionId: ['', Validators.required],
      civilStatusId: ['', Validators.required],
      educationalId: ['', Validators.required],
      schoolLastAttended: ['', Validators.required],
      yearGraduated: ['', Validators.required],
      occupation: ['', Validators.required],
      income: ['', Validators.required],
      admittingStaffId: [this.userInfo.id,Validators.required],
      caseNo: ['12', Validators.required],
      referrefBy: [this.userInfo.name, Validators.required],

    });
  } 


  onSubmit(): void {
    if (this.patientForm.valid) {
        const patientFormData = 
            this.patientForm.value
            this.patientCode = this.patientForm.value.PatientCode

        this.service.postPatientData(patientFormData).subscribe({
            next: (response) => {
                console.log('User registered successfully:', response);
                alert('User registered successfully!');
            },
            error: (err) => {
                console.error('API Error:', err);

                if (err.status === 400) {
                    alert('Validation failed. Please check your inputs.');
                } else if (err.status === 401) {
                    alert('Unauthorized. Please check your permissions.');
                } else if (err.status === 500) {
                    alert('Server error. Please try again later.');
                } else {
                    alert('Failed to register user. Please try again.');
                }
            }
        });
    } else {
        console.warn('Form submission attempted with invalid data:', this.patientForm.value);
        alert('Please fill in all required fields correctly.');
        // this.logValidationErrors(this.patientForm);
    }
}


  // logValidationErrors(group: FormGroup = this.patientForm): void {
  //   Object.keys(group.controls).forEach((key: string) => {
  //     const control = group.get(key);
  //     if (control instanceof FormGroup) {
  //       this.logValidationErrors(control);
  //     } else {
  //       if (control && control.invalid) {
  //         console.log(`Control ${key} is invalid`);
  //         console.log(control.errors);
  //       }
  //     }
  //   });
  // }

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
