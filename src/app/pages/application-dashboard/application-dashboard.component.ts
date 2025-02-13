import { Component, inject, OnInit } from '@angular/core';
import { ApplicationDashboardService } from './service/application-dashboard.service';


@Component({
  selector: 'app-application-dashboard',
  templateUrl: './application-dashboard.component.html',
  styleUrls: ['./application-dashboard.component.css']
})
export class ApplicationDashboardComponent {
  citymun : any = [];
  brgy : any = [];
  prk : any = [];
  nationality : any = [];
  civilStatus : any = [];
  religion : any = [];
  educationalAttainment : any = [];
  onChangeCitymunCode: string = '';
  onChangeBarangay: string = '';
  service = inject(ApplicationDashboardService);

  ngOnInit(): void {
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
  }
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
  }
}
