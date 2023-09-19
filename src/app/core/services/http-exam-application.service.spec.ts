import { TestBed } from '@angular/core/testing';

import { HttpExamApplicationService } from './http-exam-application.service';

describe('HttpExamApplicationService', () => {
  let service: HttpExamApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpExamApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
