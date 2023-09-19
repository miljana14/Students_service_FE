import { TestBed } from '@angular/core/testing';

import { StudentLoadOneResolver } from './student-load-one.resolver';

describe('StudentLoadOneResolver', () => {
  let resolver: StudentLoadOneResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(StudentLoadOneResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
