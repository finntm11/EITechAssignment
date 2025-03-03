import { Component, OnInit } from '@angular/core';
import {
  IWallet,
  IWalletAsset,
  // IWalletAssetHistory,
  WalletCacheService,
} from '../_services/wallet-cache.service';
import {
  ICoinCapAsset,
  CoinCapAssetService,
  ICoinCapAssetHistoryResponse,
} from '../_services/coin-cap-asset.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css',
})
export class WalletComponent implements OnInit {
  isLoading: boolean = true;
  isTradeModalOpen: boolean = false;
  availableAssets: ICoinCapAsset[] = [];
  availableFunds: number = 0;
  totalPrice: number = 0;
  wallet: IWallet = {
    totalValue: 0,
    assets: [],
    tradingSince: new Date,
  };
  tradeForm: FormGroup;

  constructor(
    private readonly walletCacheService: WalletCacheService,
    private readonly fb: FormBuilder,
    private readonly coinCapAssetService: CoinCapAssetService
  ) {
    this.tradeForm = this.fb.group({
      action: ['', Validators.required],
      asset: ['', [Validators.required, this.assetValidator.bind(this)]],
      amount: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {this.coinCapAssetService.getCoincapAssets().subscribe({
      next: (result) => {
        this.availableAssets = result.data;
        const cachedSettings = this.walletCacheService.loadWallet();
        if (cachedSettings) {
          this.wallet = cachedSettings;
          // if (!this.wallet.graph) {
          //   this.wallet.graph = this.generateWalletGraph(this.wallet).subscribe({
          //     next: (graphData) => {
          //       this.wallet.graph = graphData;
          //     },
          //     error: (error) => {
          //       console.error("Error generating graph:", error);
          //     }
          //   });
          // }
        }
        this.tradeForm.get('amount')?.valueChanges.subscribe((amount) => {
          this.updateTotalPrice(amount);
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error getting assets:', error);
        this.isLoading = false;
      },
    });
  }

  generateWalletGraph(wallet: IWallet): Observable<any> {
    const startDate = wallet?.tradingSince || new Date();
    const endDate = new Date();
    console.log("start:", startDate);
    console.log("end:", endDate);

    const assetHistoryRequests = wallet.assets.map((asset) =>
      this.coinCapAssetService.getAssetMinuteHistory(asset.id, startDate, endDate).pipe(
        map((response: ICoinCapAssetHistoryResponse) => {
          const dates = response.data.map((history) => new Date(history.time).toLocaleString());
          const prices = response.data.map((history) => parseFloat(history.priceUsd) * asset.amountOwned);
          const formattedPrices = prices.map((price) => `$${price.toFixed(2)}`);

          return { dates, prices, formattedPrices };
        }),
        catchError((error) => {
          console.error('Error fetching asset history:', error);
          return of(null); // If any error occurs, just return null
        })
      )
    );

    return new Observable((observer) => {
      forkJoin(assetHistoryRequests).pipe(
        map((assetDataList) => {
          const traces = assetDataList
            .filter((assetData) => assetData !== null)
            .map((assetData, index) => {
              if (assetData) {
                return {
                  x: assetData.dates,
                  y: assetData.prices,
                  text: assetData.formattedPrices,
                  hoverinfo: 'x+text',
                  mode: 'lines+markers',
                  type: 'scatter',
                  marker: { color: this.getColorForAsset(index), size: 4 },
                  line: { color: this.getColorForAsset(index) },
                  name: wallet.assets[index].name 
                };
              } else {
                return null;
              }
            });

          const layout = {
            title: 'Wallet Value over Time',
            xaxis: { title: { text: 'Time', standoff: 15 } },
            yaxis: { title: { text: 'Value (USD)', standoff: 15 } },
            showlegend: true,
            margin: { l: 70, r: 50, t: 50, b: 70 },
            hovermode: 'closest',
          };

          return {
            data: traces,
            layout: layout,
          };
        })
      ).subscribe(
        (graphData) => {
          observer.next(graphData);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  private getColorForAsset(index: number): string {
    const colors = ['blue', 'green', 'red', 'orange', 'purple'];
    return colors[index % colors.length];
  }

  openTradeModal() {
    this.isTradeModalOpen = true;
  }

  closeTradeModal() {
    this.tradeForm.reset();
    this.totalPrice = 0;
    this.isTradeModalOpen = false;
  }

  closeModalOnBackdropClick(event: MouseEvent): void {
    if ((event.target as Element).classList.contains('modal-backdrop')) {
      this.closeTradeModal();
    }
  }

  assetValidator(control: any) {
    const assetName = control.value;
    const asset = this.availableAssets.find(
      (a) => a.name?.toLowerCase() === assetName?.toLowerCase()
    );
    return asset ? null : { invalidAsset: true };
  }

  updateTotalPrice(amount: number) {
    const assetName = this.tradeForm.get('asset')?.value;
    const asset = this.availableAssets.find(
      (a) => a.name?.toLowerCase() === assetName?.toLowerCase()
    );

    if (asset && amount > 0) {
      this.totalPrice = amount * parseFloat(asset.priceUsd);
    } else {
      this.totalPrice = 0;
    }
  }

  onSubmit() {
    if (this.tradeForm.invalid) {
      return;
    }

    const { action, asset, amount } = this.tradeForm.value;
    const assetName = asset;
    const assetAmount = parseFloat(amount);

    const existingAsset = this.wallet.assets.find((a) => a.name === assetName);
    const assetInfo = this.availableAssets.find((a) => a.name === assetName);
    const assetId = assetInfo?.id || 'none';
    const assetPrice = Number(assetInfo?.priceUsd);

    if (action === 'buy') {
      if (existingAsset) {
        existingAsset.amountOwned = existingAsset.amountOwned + assetAmount;
        existingAsset.valueUsd =
          existingAsset.valueUsd + assetAmount * assetPrice;
      } else {
        const newAsset: IWalletAsset = {
          id: assetId,
          name: assetName,
          amountOwned: assetAmount,
          valueUsd: assetAmount * assetPrice,
          changePercent: 0,
          ownedSince: new Date(),
        };
        this.wallet.assets.push(newAsset);
      }
    } else if (action === 'sell') {
      if (!existingAsset) {
        alert('You do not own this asset!');
        return;
      }

      if (assetAmount > existingAsset.amountOwned) {
        alert('You do not have enough of this asset to sell!');
        return;
      }

      existingAsset.amountOwned = existingAsset.amountOwned - assetAmount;
      existingAsset.valueUsd =
        existingAsset.valueUsd - assetAmount * assetPrice;

      if (existingAsset.amountOwned === 0) {
        const index = this.wallet.assets.indexOf(existingAsset);
        if (index !== -1) {
          this.wallet.assets.splice(index, 1);
        }
      }
    }

    this.wallet.totalValue = this.wallet.assets
      .reduce((sum, asset) => {
        return sum + asset.valueUsd;
      }, 0);

    this.walletCacheService.saveWallet(this.wallet);

    this.closeTradeModal();
  }
}
