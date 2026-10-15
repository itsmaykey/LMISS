import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientStateService {
  private readonly PATIENT_CODE_KEY = 'lmiss_active_patient_code';
  private readonly ASSESSMENT_CODE_KEY = 'lmiss_active_assessment_code';

  private patientCodeSubject = new BehaviorSubject<string>(this.getStoredPatientCode());
  private assessmentCodeSubject = new BehaviorSubject<string>(this.getStoredAssessmentCode());

  public patientCode$: Observable<string> = this.patientCodeSubject.asObservable();
  public assessmentCode$: Observable<string> = this.assessmentCodeSubject.asObservable();

  constructor() {}

  private getStoredPatientCode(): string {
    try {
      return sessionStorage.getItem(this.PATIENT_CODE_KEY) || '';
    } catch {
      return '';
    }
  }

  private getStoredAssessmentCode(): string {
    try {
      return sessionStorage.getItem(this.ASSESSMENT_CODE_KEY) || '';
    } catch {
      return '';
    }
  }

  setPatientCode(patientCode: string): void {
    const code = patientCode ? patientCode.trim() : '';
    try {
      if (code) {
        sessionStorage.setItem(this.PATIENT_CODE_KEY, code);
      } else {
        sessionStorage.removeItem(this.PATIENT_CODE_KEY);
      }
    } catch (e) {
      console.warn('Could not access sessionStorage for patientCode', e);
    }
    this.patientCodeSubject.next(code);
  }

  setAssessmentCode(assessmentCode: string): void {
    const code = assessmentCode ? assessmentCode.trim() : '';
    try {
      if (code) {
        sessionStorage.setItem(this.ASSESSMENT_CODE_KEY, code);
      } else {
        sessionStorage.removeItem(this.ASSESSMENT_CODE_KEY);
      }
    } catch (e) {
      console.warn('Could not access sessionStorage for assessmentCode', e);
    }
    this.assessmentCodeSubject.next(code);
  }

  setSelectedPatient(patientCode: string, assessmentCode: string = ''): void {
    this.setPatientCode(patientCode);
    this.setAssessmentCode(assessmentCode);
  }

  getPatientCode(): string {
    return this.patientCodeSubject.value || this.getStoredPatientCode();
  }

  getAssessmentCode(): string {
    return this.assessmentCodeSubject.value || this.getStoredAssessmentCode();
  }

  clear(): void {
    try {
      sessionStorage.removeItem(this.PATIENT_CODE_KEY);
      sessionStorage.removeItem(this.ASSESSMENT_CODE_KEY);
    } catch (e) {
      console.warn('Could not clear sessionStorage', e);
    }
    this.patientCodeSubject.next('');
    this.assessmentCodeSubject.next('');
  }
}
