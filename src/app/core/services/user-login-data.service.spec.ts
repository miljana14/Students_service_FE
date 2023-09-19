import { TestBed } from '@angular/core/testing';

import { UserLoginDataService } from './user-login-data.service';

describe('UserLoginDataService', () => {
  let service: UserLoginDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserLoginDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
