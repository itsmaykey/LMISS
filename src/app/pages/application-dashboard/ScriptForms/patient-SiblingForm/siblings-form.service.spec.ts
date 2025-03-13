import { TestBed } from '@angular/core/testing';

import { SiblingsFormService } from './siblings-form.service';

describe('SiblingsFormService', () => {
  let service: SiblingsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiblingsFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
