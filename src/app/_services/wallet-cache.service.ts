import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WalletCacheService {

  private storageKey = 'wallet';

  saveWallet(wallet: IWallet): void {
    localStorage.setItem(this.storageKey, JSON.stringify(wallet));
  }

  loadWallet(): IWallet | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }
}

export interface IWallet {
  totalValue: number;
  assets: IWalletAsset[];
  tradingSince: Date;
  graph?: any;
}

export interface IWalletAsset {
  id: string;
  name: string;
  amountOwned: number;
  valueUsd: number;
  changePercent: number;
  ownedSince: Date;
  graph?: any;
}
