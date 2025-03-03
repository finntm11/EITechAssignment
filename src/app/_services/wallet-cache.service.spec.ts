import { TestBed } from '@angular/core/testing';

import { WalletCacheService } from './wallet-cache.service';

describe('WalletCacheService', () => {
  let service: WalletCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
