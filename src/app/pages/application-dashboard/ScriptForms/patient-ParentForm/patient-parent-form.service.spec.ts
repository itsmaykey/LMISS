import { TestBed } from '@angular/core/testing';

import { PatientParentFormService } from './patient-parent-form.service';

describe('PatientParentFormService', () => {
  let service: PatientParentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientParentFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
