import { TestBed } from '@angular/core/testing';

import { ChildrensFormService } from './childrens-form.service';

describe('ChildrensFormService', () => {
  let service: ChildrensFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChildrensFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
