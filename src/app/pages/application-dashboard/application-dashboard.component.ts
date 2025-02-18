import { Component, inject, OnInit } from '@angular/core';
import { ApplicationDashboardService } from './service/application-dashboard.service';
import { AuthService } from '../../Admin/Auth/AuthService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-application-dashboard',
  templateUrl: './application-dashboard.component.html',
  styleUrls: ['./application-dashboard.component.css'],
})
export class ApplicationDashboardComponent {


  patientForm!: FormGroup;



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


  constructor(private authService: AuthService, private fb: FormBuilder) {}
  service = inject(ApplicationDashboardService);
  selectedDrugEffects: any[] = [];

patientCode: string = '';
  userInfo: any;


  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    console.log(this.userInfo);

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

      PatientCode: [customUUID(), Validators.required] ,
      PFirstName: ['', Validators.required],
      PMiddleName: ['',],
      PLastName: ['', Validators.required],
      PExtName: ['',],
      PNickName: ['', Validators.required],
      Age: [  '', Validators.required ],
      sex: ['' , Validators.required],
      PrkCode: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^09[0-9]{9}$')]],
      Birthplace: ['', Validators.required],
      NationalityId: ['', Validators.required],
      ReligionId: ['', Validators.required],
      CivilStatusId: ['', Validators.required],
      EducationalId: ['', Validators.required],
      SchoolLastAttended: ['', Validators.required],
      YearGraduated: ['', Validators.required],
      Occupation: ['', Validators.required],
      Income: ['', Validators.required],
      AdmittingStaffId: [this.userInfo.id,Validators.required],
      CaseNo: ['12', Validators.required],
      ReferrefBy: [this.userInfo.name, Validators.required],

    });
  } //end of ngOnInit


  onSubmit(): void {
    if (this.patientForm.valid) {
      const patientFormData = {
        ...this.patientForm.value,
         sex: this.patientForm.value.sex === '0' ? false : true
      };

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
      console.warn('Form is invalid!');
      alert('Please fill in all required fields correctly.');
   //   this.logValidationErrors(this.patientForm);
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
}
