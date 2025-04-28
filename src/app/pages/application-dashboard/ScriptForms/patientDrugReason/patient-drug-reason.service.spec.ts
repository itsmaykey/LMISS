import { TestBed } from '@angular/core/testing';

import { PatientDrugReasonService } from './patient-drug-reason.service';

describe('PatientDrugReasonService', () => {
  let service: PatientDrugReasonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientDrugReasonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
