import { TestBed } from '@angular/core/testing';

import { CoincapService } from './coin-cap-asset.service';

describe('CoincapService', () => {
  let service: CoincapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoincapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
