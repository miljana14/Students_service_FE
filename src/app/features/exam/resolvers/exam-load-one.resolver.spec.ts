import { TestBed } from '@angular/core/testing';

import { ExamLoadOneResolver } from './exam-load-one.resolver';

describe('ExamLoadOneResolver', () => {
  let resolver: ExamLoadOneResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ExamLoadOneResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
