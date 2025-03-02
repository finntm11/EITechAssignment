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
