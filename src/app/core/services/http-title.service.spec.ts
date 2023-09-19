import { TestBed } from '@angular/core/testing';

import { HttpTitleService } from './http-title.service';

describe('HttpTitleService', () => {
  let service: HttpTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
