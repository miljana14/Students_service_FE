import { TestBed } from '@angular/core/testing';

import { HttpMarkService } from './http-mark.service';

describe('HttpMarkService', () => {
  let service: HttpMarkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpMarkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
