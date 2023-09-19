import { TestBed } from '@angular/core/testing';

import { ExaminationPeriodLoadOneResolver } from './examination-period-load-one.resolver';

describe('ExaminationPeriodLoadOneResolver', () => {
  let resolver: ExaminationPeriodLoadOneResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ExaminationPeriodLoadOneResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
