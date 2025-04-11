import { TestBed } from '@angular/core/testing';

import { PatientApplicationService } from './patient-application.service';

describe('PatientApplicationService', () => {
  let service: PatientApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
