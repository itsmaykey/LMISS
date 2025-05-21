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

  getApplicationHistory(data: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetApplicationHistory?patientCode=${data}`);
  }
  //Post
  postPatientData(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDatasA/PostPatientData`, data);
  }
  postPatientSchoolData(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDatasA/PostPatientSchoolData`, data);
  }
  postPatientParentData(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDatasA/PostPatientParentData`, data);
  }
  postPatientSpouseData(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDatasA/PostPatientSpouseData`, data);
  }
  postPatientSiblingData(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDatasA/PostPatientSiblingData`, data);
    }
  postPatientEmploymentData(data: any) {
      return this.http.post(`${environment.apiUrl}PostPatientDatasA/PostPatientEmploymentData`, data);
      }
  postPatientChildrenData(data: any) {
      return this.http.post(`${environment.apiUrl}PostPatientDatasA/PostPatientChildrenData`, data);
      }
  postPatientDrugHistoryData(data: any) {
        return this.http.post(`${environment.apiUrl}PostPatientDatasA/PostPatientDrugHistoryData`, data);
        }
  postPatientReasonUsingDrugsData(data: any) {
        return this.http.post(`${environment.apiUrl}PostPatientDatasA/PostPatientReasonUsingDrugsData`, data);
        }
  postPatientDrugEffectData(data: any) {
        return this.http.post(`${environment.apiUrl}PostPatientDatasA/PostPatientDrugEffectData`, data);
        }
  postPatientHealthHistoryData(data: any) {
        return this.http.post(`${environment.apiUrl}PostPatientDatasA/PostPatientHealthHistoryData`, data);
        }
  postPatientRehabilitationData(data: any) {
          return this.http.post(`${environment.apiUrl}PostPatientDatasA/PostPatientRehabilitationData`, data);
          }
  postPatientFamilyHistoryData(data: any) {
          return this.http.post(`${environment.apiUrl}PostPatientDatasA/PostPatientFamilyHistoryData`, data);
        }

//forExistedPatientDATA
  getExistedPatientData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatient?patientCode=${patientCode}`);
  }
  getExistedPatientSchoolData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatientSchool?patientCode=${patientCode}`);
  }
  getExistedPatientParentData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatientParent?patientCode=${patientCode}`);

  }
  getExistedPatientSpouseData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatientSpouse?patientCode=${patientCode}`);
  }
  getExistedPatientSiblingData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatientSiblings?patientCode=${patientCode}`);
  }
  getExistedPatientEmploymentData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatientEmployment?patientCode=${patientCode}`);
  }
  getExistedPatientChildrenData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatientChildren?patientCode=${patientCode}`);
  }
  getExistedPatientDrugHistoryData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatientDrugHistory?patientCode=${patientCode}`);
  }
  getExistedPatientDrugReasonData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatientReasonUsingDrugs?patientCode=${patientCode}`);
  }
  getExistedPatientDrugEffectData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatientDrugEffect?patientCode=${patientCode}`);
  }
  getExistedPatientHealthHistoryData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatientHealthHistory?patientCode=${patientCode}`);
  }
  getExistedPatientRehabilitationRecordData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatientPrevRehab?patientCode=${patientCode}`);
  }
  getExistedPatientFamilyHealth(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatientFamilyHealth?patientCode=${patientCode}`);
  }
  getExistedPatientAssessmentData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatientAssessment?patientCode=${patientCode}`);
  }
  getExistedAdmissionData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedAdmission?patientCode=${patientCode}`);
  }
  removeSiblings(patientCode: string, SiblingCode: string) {
    return this.http.delete(`${environment.apiUrl}RemovePatientData/RemoveSiblings?patientCode=${patientCode}&SiblingCode=${SiblingCode}`);
  }
  removeChildren(patientCode: string, ChildrenCode: string) {
    return this.http.delete(`${environment.apiUrl}RemovePatientData/RemoveChildren?patientCode=${patientCode}&ChildrenCode=${ChildrenCode}`);
  }
removeEmployment(patientCode: string, EmploymentCode: string) {
    return this.http.delete(`${environment.apiUrl}RemovePatientData/RemoveEmployment?patientCode=${patientCode}&EmploymentCode=${EmploymentCode}`);
  }
removeDrugHistory(patientCode: string, DHCode: string){
    return this.http.delete(`${environment.apiUrl}RemovePatientData/RemoveDrugHistory?patientCode=${patientCode}&DHCode=${DHCode}`);
  }

  removeRehabRecord(patientCode: string, PrevCode: string) {
   return this.http.delete(`${environment.apiUrl}RemovePatientData/RemoveRehabRecord?patientCode=${patientCode}&PrevCode=${PrevCode}`);
  }
  removeFamilyHealth(patientCode: string, familyCode: string) {
    return this.http.delete(`${environment.apiUrl}RemovePatientData/RemoveFamilyHealth?patientCode=${patientCode}&familyCode=${familyCode}`);
  }
}







