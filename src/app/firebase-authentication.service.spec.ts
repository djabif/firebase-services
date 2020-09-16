import { TestBed } from '@angular/core/testing';

import { FirebaseAuthenticationService } from './firebase-authentication.service';

describe('FirebaseAuthenticationService', () => {
  let service: FirebaseAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
