import { TestBed } from '@angular/core/testing';

import { SubjectLoadOneResolver } from './subject-load-one.resolver';

describe('SubjectLoadOneResolver', () => {
  let resolver: SubjectLoadOneResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(SubjectLoadOneResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
