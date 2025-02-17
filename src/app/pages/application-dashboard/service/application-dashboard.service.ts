import { Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApplicationDashboardService {

constructor(private http: HttpClient) { }

//Address
  getCitymun() {
    return this.http.get(`${environment.apiUrl}GetAddressReference/GetCityMun`);
  }
  getBrgy(citymunCode: string) {
    return this.http.get(`${environment.apiUrl}GetAddressReference/GetBrgy?citymunCode=${citymunCode}`);
  }
  getprk(brgyCode: string) {
    return this.http.get(`${environment.apiUrl}GetAddressReference/GetPurok?brgyCode=${brgyCode}`);
  }

  getNationality() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/GetrefCitizenship`);
  }

  getCivilStats() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/GetrefcivilStatus`);
  }
  getReligion() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/GetrefReligion`);
  }
  getEducationalAttainment() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/GetrefEdducationalAtt`);
  }
  getDrugEffect(){
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/GetrefDrugEffect`);
  }





}


