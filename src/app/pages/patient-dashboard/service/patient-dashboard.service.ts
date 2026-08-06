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
    return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatient?patientCode=${patientCode}&assessmentCode=${assessmentCode}`);
  }
  getPatientProgressReport(patientCode: string, assessmentCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientProgressReport/GetExistedPatientProgressReports?patientCode=${patientCode}&code=${assessmentCode}`);
  }
  getExistedPatientMonthlyProgressReports(patientCode: string, assessmentCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientMonthlyPsychologicalProgressReport/GetExistedPatientMonthlyProgressReports?patientCode=${patientCode}&code=${assessmentCode}`);
  }
 getExistedPatientNursingNotes(patientCode: string, assessmentCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientNursingNotes/GetExistedPatientNursingNotes?patientCode=${patientCode}&code=${assessmentCode}`);
  }
  getExistedPatientPsychologicalEvaluationReport(patientCode: string, assessmentCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDataPsychologicalEvaluationReport/GetExistedPatientPsychologicalEvaluationReport?patientCode=${patientCode}&code=${assessmentCode}`);
  }
  getExistedPatientTreatmentPlan(patientCode: string, assessmentCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDataTreatmentPlan/GetExistedPatientTreatmentPlan?patientCode=${patientCode}&code=${assessmentCode}`);
  }
  getPatientDoctorsOrder(patientCode: string, assessmentCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDoctorsOrder/GetPatientDoctorsOrder?patientCode=${patientCode}&code=${assessmentCode}`);
  }
  gettrefMPPRQuestionaire() {
    return this.http.get(`${environment.apiUrl}GetPatientMonthlyPsychologicalProgressReport/GettrefMPPRQuestionaire`);
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
  getUsers() {
    return this.http.get(`${environment.apiUrl}GetPatientDataPsychologicalEvaluationReport/GetUsers`);
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
  getrefDomain() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/getrefDomain`);
  }
/////post
  postPatientMonthlyProgressReport(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDataMonthlyPsychologicalProgressReport/PostPatientMonthlyProgressReport`, data);
  }
  postPatientNursingNotes(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDataNursingNotes/PostPatientNursingNotes`, data);
  }
   postPatientProgressReport(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDataProgressReport/PostPatientProgressReport`, data);
  }
  postPatientPsychologicalEvaluationReport(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDataPsychologicalEvaluationReport/PostPatientPsychologicalEvaluationReport`, data);
  }
  postPatientTreatmentPlan(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDataTreatmentPlan/PostPatientTreatmentPlan`, data);
  }
  postPatientDoctorsOrder(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDoctorsOrder`, data);
  }
}
