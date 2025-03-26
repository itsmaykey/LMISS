import { TestBed } from '@angular/core/testing';

import { PatientDrugEffectService } from './patient-drug-effect.service';

describe('PatientDrugEffectService', () => {
  let service: PatientDrugEffectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientDrugEffectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
