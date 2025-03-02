import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ICoincapAsset, CoincapService } from '../services/coincap.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.css',
})
export class AssetsComponent implements OnInit, AfterViewInit {
  assets: ICoincapAsset[] = [];
  displayedColumns: string[] = ['rank', 'name', 'priceUsd', 'supply'];
  dataSource: MatTableDataSource<ICoincapAsset> =
    new MatTableDataSource<ICoincapAsset>();
  pageOptions: number[] = []; 
  searchQuery: string = "";

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private readonly coinCapService: CoincapService) {}

  ngOnInit(): void {
    this.coinCapService.getCoincapAssets().subscribe({
      next: (result) => {
        this.assets = result.data;
        this.dataSource = new MatTableDataSource(this.assets);
        this.pageOptions = this.generatePageOptions(this.assets.length);
      },
      error: (error) => {
        console.error('Failed to fetch assets:', error);
      },
    });
  }

  ngAfterViewInit() {
    if (this.sort && this.paginator) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  private generatePageOptions(totalAssets: number): number[] {
    const options: number[] = [];
    let pageSize = 10;
    while (pageSize <= totalAssets) {
      options.push(pageSize);
      pageSize += 10;
    }
    return options;
  }
}
