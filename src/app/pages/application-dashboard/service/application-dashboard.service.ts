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
  getDrugSubstance() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/GetrefDrugSubstance`);
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
  postPatientParentData(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDatas/PostPatientParentData`, data);
  }
  postPatientSpouseData(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDatas/PostPatientSpouseData`, data);
  }
  postPatientSiblingData(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDatas/PostPatientSiblingData`, data);
    }
  postPatientEmploymentData(data: any) {
      return this.http.post(`${environment.apiUrl}PostPatientDatas/PostPatientEmploymentData`, data);
      }
  postPatientChildrenData(data: any) {
      return this.http.post(`${environment.apiUrl}PostPatientDatas/PostPatientChildrenData`, data);
      }
  postPatientDrugHistoryData(data: any) {
        return this.http.post(`${environment.apiUrl}PostPatientDatas/PostPatientDrugHistoryData`, data);
        }
  postPatientReasonUsingDrugsData(data: any) {
        return this.http.post(`${environment.apiUrl}PostPatientDatas/PostPatientReasonUsingDrugsData`, data);
        }
  postPatientDrugEffectData(data: any) {
        return this.http.post(`${environment.apiUrl}PostPatientDatas/PostPatientDrugEffectData`, data);
        }
  postPatientHealthHistoryData(data: any) {
        return this.http.post(`${environment.apiUrl}PostPatientDatas/PostPatientHealthHistoryData`, data);
        }
  postPatientRehabilitationData(data: any) {
          return this.http.post(`${environment.apiUrl}PostPatientDatas/PostPatientRehabilitationData`, data);
          }
  postPatientFamilyHistoryData(data: any) {
          return this.http.post(`${environment.apiUrl}PostPatientDatas/PostPatientFamilyHistoryData`, data);
        }
  postPatientAssessmentData(data: any) {
          return this.http.post(`${environment.apiUrl}PostPatientDatas/PostPatientAssessmentData`, data);
        }
  postAdmissionData(data: any) {
          return this.http.post(`${environment.apiUrl}PostPatientDatas/PostAdmissionData`, data);
        }
//forExistedPatientDATA
  getExistedPatientData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatient?patientCode=${patientCode}`);
  }
  getExistedPatientSchoolData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatientSchool?patientCode=${patientCode}`);
  }
  getExistedPatientParentData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatientParent?patientCode=${patientCode}`);

  }
  getExistedPatientSpouseData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatientSpouse?patientCode=${patientCode}`);
  }
  getExistedPatientSiblingData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatientSiblings?patientCode=${patientCode}`);
  }
  getExistedPatientEmploymentData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatientEmployment?patientCode=${patientCode}`);
  }
  getExistedPatientChildrenData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatientChildren?patientCode=${patientCode}`);
  }
  getExistedPatientDrugHistoryData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatientDrugHistory?patientCode=${patientCode}`);
  }
  getExistedPatientDrugReasonData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatientReasonUsingDrugs?patientCode=${patientCode}`);
  }
  getExistedPatientDrugEffectData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatientDrugEffect?patientCode=${patientCode}`);
  }
  getExistedPatientHealthHistoryData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatientHealthHistory?patientCode=${patientCode}`);
  }
  getExistedPatientRehabilitationRecordData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatientPrevRehab?patientCode=${patientCode}`);
  }
  getExistedPatientFamilyHealth(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatientFamilyHealth?patientCode=${patientCode}`);
  }
  getExistedPatientAssessmentData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatientAssessment?patientCode=${patientCode}`);
  }
  getExistedPatientAdmissionData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatientAdmission?patientCode=${patientCode}`);
  }
}







