import { TestBed } from '@angular/core/testing';

import { PatientStaffAssessmentService } from './patient-staff-assessment.service';

describe('PatientStaffAssessmentService', () => {
  let service: PatientStaffAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientStaffAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
