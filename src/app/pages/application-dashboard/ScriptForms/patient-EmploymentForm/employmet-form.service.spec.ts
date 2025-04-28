import { TestBed } from '@angular/core/testing';

import { EmploymetFormService } from './employmet-form.service';

describe('EmploymetFormService', () => {
  let service: EmploymetFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmploymetFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
