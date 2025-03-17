import { TestBed } from '@angular/core/testing';

import { EmploymentFormService } from './employment-form.service';

describe('EmploymentFormService', () => {
  let service: EmploymentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmploymentFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
