import { TestBed } from '@angular/core/testing';

import { HttpExaminationPeriodService } from './http-examination-period.service';

describe('HttpExaminationPeriodService', () => {
  let service: HttpExaminationPeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpExaminationPeriodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
