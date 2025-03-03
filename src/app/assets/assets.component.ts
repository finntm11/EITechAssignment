import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import {
  ICoinCapAsset,
  CoinCapAssetService,
} from '../_services/coin-cap-asset.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.css',
})
export class AssetsComponent implements OnInit, AfterViewInit {
  isLoading: boolean = true;
  isTableInitialized: boolean = false;
  assets: ICoinCapAsset[] = [];
  displayedColumns: string[] = [
    'rank',
    'name',
    'priceUsd',
    'supply',
    'changePercent24Hr',
    'actions',
  ];
  dataSource: MatTableDataSource<ICoinCapAsset> =
    new MatTableDataSource<ICoinCapAsset>();
  pageOptions: number[] = [];
  searchQuery: string = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  Number = Number;

  constructor(
    private readonly coinCapAssetService: CoinCapAssetService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.coinCapAssetService.getCoincapAssets().subscribe({
      next: (result) => {
        this.assets = result.data;
        this.dataSource = new MatTableDataSource(this.assets);
        this.pageOptions = this.generatePageOptions(this.assets.length);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to fetch assets:', error);
        this.isLoading = false;
      },
    });
  }

  ngAfterViewInit() {
    this.initializeTable();
  }

  ngAfterViewChecked() {
    this.initializeTable();
  }

  initializeTable() {
    if (
      !this.isTableInitialized &&
      this.sort &&
      this.paginator &&
      this.dataSource.data.length
    ) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isTableInitialized = true;
    }
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  resetSearch() {
    this.searchQuery = '';
    this.applyFilter();
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
