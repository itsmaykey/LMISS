import { Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment.prod';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError,  } from 'rxjs';

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
  getAdmissionType(){
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/GetrefAdmissionType`);
  }

  //Post
  postPatientData(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDatas/PostPatientData`, data);
  }
  postPatientSchoolData(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDatas/PostPatientSchoolData`, data);
  }

//forExistedPatient
  getExistedPatientData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatient?patientCode=${patientCode}`);
  }
  getExistedPatientSchoolData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatientSchool?patientCode=${patientCode}`);
  }
  // postPatientData(data: any): Observable<any> {
  //   return this.http.post(`${environment.apiUrl}PostPatientDatas/PostPatientData`, data)
  //     .pipe(
  //       catchError((error: HttpErrorResponse) => {
  //         console.error('Error Status:', error.status);
  //         console.error('Error Message:', error.message);
  //         console.error('Error Response:', error.error);
  //         return throwError(error);
  //       })
  //     );



  }









