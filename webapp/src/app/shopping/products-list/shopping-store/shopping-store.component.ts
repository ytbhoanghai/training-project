import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from './../../../manager/store-management/store.service';
import { IStore } from 'src/app/manager/store-management/store.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-store',
  templateUrl: './shopping-store.component.html',
  styleUrls: ['./shopping-store.component.css'],
})
export class ShoppingStoreComponent implements OnInit {
  stores: IStore[] = [];
  selectedStoreId: number;
  categoryId: number;

  constructor(
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchStores();
    this.route.params.subscribe((params) => {
      this.categoryId = +params.categoryId;
      this.selectedStoreId = +params.storeId;
    });
  }

  fetchStores(): void {
    this.storeService.fetchStores().subscribe((stores) => {
      this.stores = stores;
    });
  }

  navigateUrl(storeId: number): void {
    this.router.navigate(
      ['/shopping', 'store', storeId, 'category', this.categoryId || 'all'],
      { queryParams: { page: 1 } }
    );
  }
}
