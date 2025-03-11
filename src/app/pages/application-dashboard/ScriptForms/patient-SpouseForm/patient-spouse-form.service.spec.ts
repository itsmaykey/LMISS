import { TestBed } from '@angular/core/testing';

import { PatientSpouseFormService } from './patient-spouse-form.service';

describe('PatientSpouseFormService', () => {
  let service: PatientSpouseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientSpouseFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
