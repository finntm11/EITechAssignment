import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoincapService {
  private apiUrl = 'https://api.coincap.io/v2';

  constructor(private http: HttpClient) {}

  getCoincapAssets(): Observable<ICoincapAssetResponse> {
    return this.http.get<ICoincapAssetResponse>(`${this.apiUrl}/assets`)
  }
}

export interface ICoincapAsset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
}

export interface ICoincapAssetResponse {
  data: ICoincapAsset[];
  timestamp: number;
}
