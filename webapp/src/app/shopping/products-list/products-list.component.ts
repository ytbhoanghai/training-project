import {
  IProduct,
  ProductService,
} from './../../manager/product-management/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  products: IProduct[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.fetchProducts().subscribe((products) => {
      this.products = products;
    });
  }

  filterByCategory(id: number): void {
    console.log('filter category', id);
  }
}
