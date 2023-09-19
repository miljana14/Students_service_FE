import { TestBed } from '@angular/core/testing';

import { HttpExamService } from './http-exam.service';

describe('HttpExamService', () => {
  let service: HttpExamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpExamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
