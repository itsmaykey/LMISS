import { TestBed } from '@angular/core/testing';
import { PatientStateService } from './patient-state.service';

describe('PatientStateService', () => {
  let service: PatientStateService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientStateService);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get patientCode without exposing in URL', () => {
    const testCode = 'DDNPQR-FHM10WJMQYSS';
    service.setPatientCode(testCode);
    expect(service.getPatientCode()).toBe(testCode);
    expect(sessionStorage.getItem('lmiss_active_patient_code')).toBe(testCode);
  });

  it('should set and get assessmentCode', () => {
    const testAssessment = 'ASSESSMENT-2026';
    service.setAssessmentCode(testAssessment);
    expect(service.getAssessmentCode()).toBe(testAssessment);
    expect(sessionStorage.getItem('lmiss_active_assessment_code')).toBe(testAssessment);
  });

  it('should set both patient and assessment codes with setSelectedPatient', () => {
    service.setSelectedPatient('DDNPQR-FHM10WJMQYSS', 'ASSESSMENT-001');
    expect(service.getPatientCode()).toBe('DDNPQR-FHM10WJMQYSS');
    expect(service.getAssessmentCode()).toBe('ASSESSMENT-001');
  });

  it('should clear stored codes on clear()', () => {
    service.setSelectedPatient('DDNPQR-FHM10WJMQYSS', 'ASSESSMENT-001');
    service.clear();
    expect(service.getPatientCode()).toBe('');
    expect(service.getAssessmentCode()).toBe('');
    expect(sessionStorage.getItem('lmiss_active_patient_code')).toBeNull();
    expect(sessionStorage.getItem('lmiss_active_assessment_code')).toBeNull();
  });
});
