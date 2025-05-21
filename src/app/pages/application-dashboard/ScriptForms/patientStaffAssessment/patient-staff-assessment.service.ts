
import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../Environments/environment';
@Injectable({
  providedIn: 'root'
})

export class PatientStaffAssessmentService{



 constructor(private http: HttpClient) { }
  getAdmissionType(){
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/GetrefAdmissionType`);
  }
  postPatientAssessmentData(data: any) {
          return this.http.post(`${environment.apiUrl}PostPatientDatasA/PostPatientAssessmentData`, data);
        }
  postAdmissionData(data: any) {
          return this.http.post(`${environment.apiUrl}PostPatientDatasA/PostAdmissionData`, data);
        }

  
}

