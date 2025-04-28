import { TestBed } from '@angular/core/testing';

import { PatientRehabRecordService } from './patient-rehab-record.service';

describe('PatientRehabRecordService', () => {
  let service: PatientRehabRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientRehabRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
