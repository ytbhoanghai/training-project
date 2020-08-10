import { ActivatedRoute } from '@angular/router';
import { CustomerService } from './../../service/customer.service';
import { IProduct } from './../../manager/product-management/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  products: IProduct[] = [];

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.route.params.subscribe((params) => {
      this.fetchProducts(
        params.storeId,
        params.categoryId === 'all' ? -1 : params.categoryId
      );
    });
  }

  fetchProducts(storeId = 14, categoryId = -1): void {
    this.customerService
      .fetchProductsByStoreAndCategory(storeId, categoryId)
      .subscribe((products) => {
        this.products = products;
      });
  }

  isEmptyResult(): boolean {
    return !this.products.length;
  }
}
