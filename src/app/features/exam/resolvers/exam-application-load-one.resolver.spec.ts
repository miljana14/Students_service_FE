import { TestBed } from '@angular/core/testing';

import { ExamApplicationLoadOneResolver } from './exam-application-load-one.resolver';

describe('ExamApplicationLoadOneResolver', () => {
  let resolver: ExamApplicationLoadOneResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ExamApplicationLoadOneResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
