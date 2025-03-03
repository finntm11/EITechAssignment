import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  welcomeMessage: string = 
  "This angular web app was created by Finn Tomasula Martin for the Expert Institute technical interview assignment. It allows you to view and simulate interacting with various crypto currency assets via the CoinCap API 2. You are currently in the \"Home\" page. Navigating to the \"Assets page\" will allow you to see a high level list of each asset as well as further details on each one that be accessed by clicking the specific asset. Navigating to the \"Wallet\" page allows you to simulate buying and selling various assets and tracking the performance of your portfolio over time. Data in the wallet will be cached locally, so it's state should persist between sessions."
}
