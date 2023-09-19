import { TestBed } from '@angular/core/testing';

import { HttpProfessorService } from './http-professor.service';

describe('HttpProfessorService', () => {
  let service: HttpProfessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpProfessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
