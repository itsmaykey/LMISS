import { TestBed } from '@angular/core/testing';

import { SocialWorkerNotesService } from './social-worker-notes.service';

describe('SocialWorkerNotesService', () => {
  let service: SocialWorkerNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialWorkerNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
