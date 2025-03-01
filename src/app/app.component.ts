import { Component, OnInit } from '@angular/core';
import { CryptoService } from './services/crypto.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  cryptoData: any[] = [];

  constructor(private cryptoService: CryptoService) { }

  ngOnInit(): void {
    this.cryptoService.getCryptoData().subscribe({
      next: (data) => {
        this.cryptoData = data.data;  // CoinCap returns data under a "data" key
      },
      error: (err) => {
        console.error('Error fetching crypto data', err);
      }
    });
  }

}
