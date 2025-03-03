import { Component, OnInit } from '@angular/core';
import {
  ICoinCapAsset,
  ICoinCapAssetHistory,
  CoinCapAssetService,
} from '../../_services/coin-cap-asset.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.css',
})
export class AssetDetailsComponent implements OnInit {
  isLoading = true;
  asset!: ICoinCapAsset;
  public graph: any;
  Number = Number;

  constructor(
    private readonly coinCapAssetService: CoinCapAssetService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const assetId: string | null = params.get('id');

      forkJoin({
        $asset: this.coinCapAssetService.getCoincapAssetById(assetId),
        $assetHistory: this.coinCapAssetService.getAssetDailyHistory(assetId),
      }).subscribe({
        next: (results) => {
          this.asset = results.$asset.data;
          this.graph = this.generateGraph(results.$assetHistory.data);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to get asset:', error);
        },
      });
    });
  }

  generateGraph(assetData: ICoinCapAssetHistory[]): any {
    const dates = assetData.map((item) => new Date(item.time));
    const prices = assetData.map((item) => parseFloat(item.priceUsd));
    const formattedPrices = assetData.map(
      (item) => `$${parseFloat(item.priceUsd).toFixed(2)}`
    );

    const trace = {
      x: dates,
      y: prices,
      text: formattedPrices,
      hoverinfo: 'x+text',
      mode: 'lines+markers',
      type: 'scatter',
      marker: { color: 'blue', size: 4 },
      line: { color: 'blue' },
    };

    const layout = {
      title: 'Price over Time',
      xaxis: { title: { text: 'Time', standoff: 15 } },
      yaxis: { title: { text: 'Price (USD)', standoff: 15 } },
      showlegend: false,
      margin: { l: 70, r: 50, t: 50, b: 70 },
      hovermode: 'closest',
    };

    return {
      data: [trace],
      layout: layout,
    };
  }
}
