import { TestBed } from '@angular/core/testing';

import { ProfessorLoadOneResolver } from './professor-load-one.resolver';

describe('ProfessorLoadOneResolver', () => {
  let resolver: ProfessorLoadOneResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ProfessorLoadOneResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
