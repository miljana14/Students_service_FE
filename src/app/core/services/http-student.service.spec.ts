import { TestBed } from '@angular/core/testing';

import { HttpStudentService } from './http-student.service';

describe('HttpStudentService', () => {
  let service: HttpStudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpStudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
