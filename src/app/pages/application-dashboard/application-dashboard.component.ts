import { Component, inject, OnInit } from '@angular/core';
import { ApplicationDashboardService } from './service/application-dashboard.service';
import { AuthService } from '../../Admin/Auth/AuthService';

@Component({
  selector: 'app-application-dashboard',
  templateUrl: './application-dashboard.component.html',
  styleUrls: ['./application-dashboard.component.css']
})
export class ApplicationDashboardComponent {

  constructor(private authService: AuthService) { }

  citymun : any = [];
  brgy : any = [];
  prk : any = [];
  nationality : any = [];
  civilStatus : any = [];
  religion : any = [];
  drugEffects: any = [];

  educationalAttainment : any = [];
  onChangeCitymunCode: string = '';
  onChangeBarangay: string = '';

  service = inject(ApplicationDashboardService);
  selectedDrugEffects: any[]= [];

  userInfo:any;
  ngOnInit(): void {

    this.userInfo = this.authService.getUserInfo();
console.log(this.userInfo);

 //Educational Attainment
 this.service.getDrugEffect().subscribe({
  next: (response) => {
    this.drugEffects = (response as any[]).map(effect => ({
      ...effect,
      selected: false
    }));
  },
  error: (error) => {
    console.error('Error:', error);
  }
});

    //Educational Attainment
    this.service.getEducationalAttainment().subscribe({
      next: (response) => {
        this.educationalAttainment = response;
        console.log('Educational Attainment:',  this.educationalAttainment);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
//Religion
    this.service.getReligion().subscribe({
      next: (response) => {
        this.religion = response;
        console.log('Religion:',  this.religion);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
    //Civil Status
    this.service.getCivilStats().subscribe({
      next: (response) => {
        this.civilStatus = response;
        console.log('Civil Status:',  this.civilStatus);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
   //Nationality
   this.service.getNationality().subscribe({
    next: (response) => {
      this.nationality = response;
      console.log('Nationality:',  this.nationality);
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
    //Citymun
    this.service.getCitymun().subscribe({
      next: (response) => {
        this.citymun = response;
        console.log('citymun:',  this.citymun);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  } //end of ngOnInit

  onCheckboxChange(event: Event, drugEffect: any): void {
    const checkbox = event.target as HTMLInputElement;
    drugEffect.selected = checkbox.checked;

    if (checkbox.checked) {
      this.selectedDrugEffects.push(drugEffect);
    } else {
      const index = this.selectedDrugEffects.findIndex(effect => effect.drugEffectCode === drugEffect.drugEffectCode);
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
        console.log('brgy:',  this.brgy);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  } //end of onMunicipalityChange
  onBarangayChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.onChangeBarangay = selectElement.value;

    console.log('Brgy changed to:', selectElement.value);

    this.service.getprk(this.onChangeBarangay).subscribe({
      next: (response) => {
        this.prk = response;
        console.log('prk:',  this.prk);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  } //end of onBarangayChange

  siblings: any[] = [
    { name: '', age: '', sex: '', civilStatus: '', occupation: '', education: '' }
  ];

  siblingsaddRow() {
    this.siblings.push({ name: '', age: '', sex: '', civilStatus: '', occupation: '', education: '' });
  }

  childrens: any[] = [
    { name: '', age: '', sex: '', civilStatus: '', occupation: '', education: '' }
  ];

  childrensaddRow() {
    this.childrens.push({ name: '', age: '', sex: '', civilStatus: '', occupation: '', education: '' });
  }
  employments: any[] = [
    { epd: '', nca: '', addr: '', pos: '', }
  ];
  employmentsaddRow() {
    this.employments.push({ epd: '', nca: '', addr: '', pos: '',});
  }
  drugHistories: any[] = [
    { dc: '', ds: '', lu: '', udq: '', hd: '', }
  ]
  drughistoriessaddRow() {
    this.drugHistories.push({ dc: '', ds: '', lu: '', udq: '', hd: '',});
  }

  PrevRehab: any[] = [
    { pr: '', rc: '', whe: '',  }
  ]
  PrevRehabaddRow() {
    this.PrevRehab.push({ pr: '', rc: '', whe: '', });
  }
  FamHealthHistories: any[] =[
  { n: '', bp: '', h: '',  w: '',  rr: '',  cr: '',  tms: '',  }
]
FamHealthHistoriesaddRow() {
  this.FamHealthHistories.push({ n: '', bp: '', h: '',  w: '',  rr: '',  cr: '',  tms: '', });
}
}
