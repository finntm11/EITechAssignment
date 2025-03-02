import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AssetsComponent } from './assets/assets.component';
import { AssetDetailsComponent } from './assets/asset-details/asset-details.component';
import { WalletComponent } from './wallet/wallet.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'assets', component: AssetsComponent },
  { path: 'asset/:id', component: AssetDetailsComponent},
  { path: 'wallet', component: WalletComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
