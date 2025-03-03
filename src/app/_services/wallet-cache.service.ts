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
  totalValue: string;
  assets: IWalletAsset[];
}

export interface IWalletAsset {
  name: string;
  amountOwned: string;
  valueUsd: string;
  changePercent: string;
  history: IWalletAssetHistory[];
  graph?: any;
}

export interface IWalletAssetHistory {
  time: string;
  priceUsd: string;
}
