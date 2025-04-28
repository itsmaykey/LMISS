import { TestBed } from '@angular/core/testing';

import { PatientDrugHistoryService } from './patient-drug-history.service';

describe('PatientDrugHistoryService', () => {
  let service: PatientDrugHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientDrugHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
