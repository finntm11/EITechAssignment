import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoinCapAssetService {
  private apiUrl = 'https://api.coincap.io/v2/assets';

  constructor(private http: HttpClient) {}

  getCoincapAssets(): Observable<ICoinCapAssetsResponse> {
    return this.http.get<ICoinCapAssetsResponse>(`${this.apiUrl}`)
  }

  getCoincapAssetById(id: string | null): Observable<ICoinCapAssetResponse> {
    return this.http.get<ICoinCapAssetResponse>(`${this.apiUrl}/${id}`)
  } 

  getAssetDailyHistory(id: string | null): Observable<ICoinCapAssetHistoryResponse> {
    return this.http.get<ICoinCapAssetHistoryResponse>(`${this.apiUrl}/${id}/history?interval=d1`)
  }

  getAssetMinuteHistory(id: string | null, startDate: Date, endDate: Date): Observable<ICoinCapAssetHistoryResponse> {
    const startUnixTime = startDate.getTime();
    const endUnixTime = endDate.getTime();      
    
    const url = `${this.apiUrl}/${id}/history?interval=m1&start=${startUnixTime}&end=${endUnixTime}`;
    
    return this.http.get<ICoinCapAssetHistoryResponse>(url);
  }
  
}

export interface ICoinCapAsset {
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

export interface ICoinCapAssetResponse {
  data: ICoinCapAsset;
  timestamp: number;
}

export interface ICoinCapAssetsResponse {
  data: ICoinCapAsset[];
  timestamp: number;
}

export interface ICoinCapAssetHistory {
  priceUsd: string;
  time: number;
}

export interface ICoinCapAssetHistoryResponse {
  data: ICoinCapAssetHistory[];
  timestamp: number;
}
