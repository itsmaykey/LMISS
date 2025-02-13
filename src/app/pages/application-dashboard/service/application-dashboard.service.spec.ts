import { TestBed } from '@angular/core/testing';

import { ApplicationDashboardService } from './application-dashboard.service';

describe('ServiceService', () => {
  let service: ApplicationDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
