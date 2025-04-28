import { TestBed } from '@angular/core/testing';

import { PatientFamHealthService } from './patient-fam-health.service';

describe('PatientFamHealthService', () => {
  let service: PatientFamHealthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientFamHealthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
