import { TestBed } from '@angular/core/testing';

import { CheckAuthoritiesGuard } from './check-authorities.guard';

describe('CheckAuthoritiesGuard', () => {
  let guard: CheckAuthoritiesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckAuthoritiesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
