import { Component, OnInit } from '@angular/core';
import {
  ICoinCapAsset,
  CoinCapAssetService,
} from '../../services/coin-cap-asset.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.css',
})
export class AssetDetailsComponent implements OnInit {
  isLoading = true;
  asset!: ICoinCapAsset;
  public graph = {
    data: [
        { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
        { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
    ],
    layout: {width: 320, height: 240, title: 'A Fancy Plot'}
};

  constructor(
    private readonly coinCapAssetService: CoinCapAssetService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const assetId: string | null = params.get('id');

      this.coinCapAssetService.getCoincapAssetById(assetId).subscribe({
        next: (result) => {
          this.asset = result.data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error("Failed to get asset:", error);
          this.isLoading = false;
        }
      });
    });
  }
}
