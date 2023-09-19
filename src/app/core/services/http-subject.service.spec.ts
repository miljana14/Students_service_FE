import { TestBed } from '@angular/core/testing';

import { HttpSubjectService } from './http-subject.service';

describe('HttpSubjectService', () => {
  let service: HttpSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
