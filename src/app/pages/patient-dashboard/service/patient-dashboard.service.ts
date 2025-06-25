import { Injectable,  } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PatientDashboardService {

  constructor(private http: HttpClient) { }

 getExistedPatientData(patientCode: string, assessmentCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatient?patientCode=${patientCode}&assessmentCode=${assessmentCode}`);
  }
  postPatientProgressReport(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDatasB/PostPatientProgressReport`, data);
  }
  getPatientProgressReport(patientCode: string, interventionCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasB/GetExistedPatientProgressReports?patientCode=${patientCode}&interventionCode=${interventionCode}`);
  }
  gettrefMPPRQuestionaire() {
    return this.http.get(`${environment.apiUrl}getrefAppearance/GettrefMPPRQuestionaire`);
  }
 getrefAppearance() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/getrefAppearance`);
  }
  getrefSensorium() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/getrefSensorium`);
  }
   getrefFunctioning() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/getrefFunctioning`);
  }
  getrefSpeech() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/getrefSpeech`);
  }
  getrefBehavior() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/getrefBehavior`);
  }
  getrefMoodAffect() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/getrefMoodAffect`);
  }
  getrefDailyPatterns() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/getrefDailyPatterns`);
  }
  getrefThoughtContent() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/getrefThoughtContent`);
  }
   getrefPhysicalIndicator() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/getrefPhysicalIndicator`);
  }
  getrefDenial() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/getrefDenial`);
  }
  getrefPhysicalWithdrawalSymptoms() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/getrefPhysicalWithdrawalSymptoms`);
  }
  getrefSuspensionofactivity() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/getrefSuspensionofactivity`);
  }
  getrefCravings() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/getrefCravings`);
  }
}
