import { Component, OnInit } from '@angular/core';
import {
  IWallet,
  IWalletAsset,
  WalletCacheService,
  IWalletAssetHistory,
} from '../_services/wallet-cache.service';
import {
  ICoinCapAsset,
  CoinCapAssetService,
} from '../_services/coin-cap-asset.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    totalValue: '0',
    assets: [],
  };
  tradeForm: FormGroup;
  public graph = {
    data: [
        { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
        { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
    ],
    layout: {width: 320, height: 240, title: 'A Fancy Plot'}
};

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

  ngOnInit(): void {
    this.coinCapAssetService.getCoincapAssets().subscribe({
      next: (result) => {
        this.availableAssets = result.data;
        const cachedSettings = this.walletCacheService.loadWallet();
        if (cachedSettings) {
          this.wallet = cachedSettings;
          for (let asset of this.wallet.assets) {
            asset.graph = this.generateAssetGraph(asset.history);
          }
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

  generateAssetGraph(assetData: IWalletAssetHistory[]): any {
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
    const assetPrice = Number(this.availableAssets.find((a) => a.name === assetName)?.priceUsd);

    if (action === 'buy') {
      if (existingAsset) {
        existingAsset.amountOwned = (
          parseFloat(existingAsset.amountOwned) + assetAmount
        ).toString();
        existingAsset.valueUsd = (
          parseFloat(existingAsset.valueUsd) +
          assetAmount * assetPrice
        ).toString();
      } else {
        const newAsset: IWalletAsset = {
          name: assetName,
          amountOwned: assetAmount.toString(),
          valueUsd: (assetAmount * assetPrice).toString(),
          changePercent: '0',
          history: [],
        };
        this.wallet.assets.push(newAsset);
      }
    } else if (action === 'sell') {
      if (!existingAsset) {
        alert('You do not own this asset!');
        return;
      }

      if (assetAmount > parseFloat(existingAsset.amountOwned)) {
        alert('You do not have enough of this asset to sell!');
        return;
      }

      existingAsset.amountOwned = (
        parseFloat(existingAsset.amountOwned) - assetAmount
      ).toString();
      existingAsset.valueUsd = (
        parseFloat(existingAsset.valueUsd) -
        assetAmount * assetPrice
      ).toString();

      if (parseFloat(existingAsset.amountOwned) === 0) {
        const index = this.wallet.assets.indexOf(existingAsset);
        if (index !== -1) {
          this.wallet.assets.splice(index, 1);
        }
      }
    }

    this.wallet.totalValue = this.wallet.assets
      .reduce((sum, asset) => {
        return sum + parseFloat(asset.valueUsd);
      }, 0)
      .toString();

    this.walletCacheService.saveWallet(this.wallet);

    this.closeTradeModal();
  }
}
