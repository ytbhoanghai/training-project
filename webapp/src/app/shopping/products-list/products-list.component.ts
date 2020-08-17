import { IStore } from 'src/app/manager/store-management/store.service';
import { NotificationService } from './../../layouts/notification/notification.service';
import { StoreService } from './../../manager/store-management/store.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CustomerService,
  IPageableProduct,
  IProductFilter,
} from './../../service/customer.service';
import { IProduct } from './../../manager/product-management/product.service';
import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  pageableProducts: IPageableProduct;
  products: IProduct[] = [];
  stores: IStore[] = [];
  isLoading = true;

  constructor(
    private customerService: CustomerService,
    private storeService: StoreService,
    private notiService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    combineLatest(this.route.params, this.route.queryParams)
      .pipe(
        map(
          (result) =>
            ({ params: result[0], query: result[1] } as IProductFilter)
        )
      )
      .subscribe((filter: IProductFilter) => {
        const { params, query } = filter;
        if (params.storeId === undefined || !params.storeId) {
          this.fetchStores();
          return;
        }

        this.fetchProducts(
          params.storeId,
          params.categoryId,
          query.page,
          query.size,
          query.search
        );
      });
  }

  fetchProducts(
    storeId: number,
    categoryId: number,
    page: number,
    size?: number,
    search?: string
  ): void {
    if (String(categoryId) === 'all') {
      categoryId = -1;
    }

    this.customerService
      .fetchProductsByStoreAndCategory(storeId, categoryId, page, size, search)
      .subscribe((res) => {
        this.pageableProducts = res;
        this.products = res.products;
        this.isLoading = false;
      });
  }

  fetchStores(): void {
    this.storeService.fetchStores().subscribe((stores) => {
      if (!stores.length) {
        this.notiService.showError('No store has been created!');
        return;
      }

      this.stores = stores;
      this.router.navigate(
        ['/shopping/store', this.stores[0].id, 'category', 'all'],
        { queryParams: { page: 1 } }
      );
    });
  }

  isEmptyResult(): boolean {
    return !this.products.length;
  }
}
