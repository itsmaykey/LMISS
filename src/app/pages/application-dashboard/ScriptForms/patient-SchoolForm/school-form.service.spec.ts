import { TestBed } from '@angular/core/testing';

import { SchoolFormService } from './school-form.service';

describe('SchoolFormService', () => {
  let service: SchoolFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
