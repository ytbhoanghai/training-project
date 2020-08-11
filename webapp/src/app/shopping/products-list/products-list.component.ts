import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CustomerService, IPageableProduct, IProductFilter } from './../../service/customer.service';
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

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.fetchProducts();
    // this.route.params.subscribe((params) => {
    //   console.log('params');
    //   this.fetchProducts(
    //     params.storeId,
    //     params.categoryId === 'all' ? -1 : params.categoryId
    //   );
    // });
    combineLatest(this.route.params, this.route.queryParams)
      .pipe(
        map((result) => ({ params: result[0], query: result[1] } as IProductFilter))
      )
      .subscribe((filter: IProductFilter) => {
        const { params, query } = filter;
        this.fetchProducts(
          params.storeId,
          params.categoryId,
          query.page,
          query.size
        );
      });
  }

  fetchProducts(storeId = 14, categoryId = -1, page = 1, size = 6): void {
    if (String(categoryId) === 'all') {
      categoryId = -1;
    }

    this.customerService
      .fetchProductsByStoreAndCategory(storeId, categoryId, page, size)
      .subscribe((res) => {
        this.pageableProducts = res;
        this.products = res.products;
      });
  }

  isEmptyResult(): boolean {
    return !this.products.length;
  }
}
