import {
  IProduct,
  ProductService,
} from './../../../manager/product-management/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-product',
  templateUrl: './store-product.component.html',
  styleUrls: ['./store-product.component.css'],
})
export class StoreProductComponent implements OnInit {
  addedProducts: IProduct[] = [];
  remainedProducts: IProduct[] = [];

  selectedProductId: number;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.fetchProducts().subscribe((products) => {
      this.remainedProducts = products;
      this.resetSelected();
    });
  }

  addProduct(): void {
    let product: IProduct = this.remainedProducts.find(
      (p) => p.id === this.selectedProductId
    );
    // Exit on error
    if (!product) return;

    this.addedProducts.push(product);
    this.remainedProducts = this.remainedProducts.filter(
      (p) => p.id !== this.selectedProductId
    );
    this.resetSelected();
  }

  removeProduct(product: IProduct): void {
    this.remainedProducts.push(product);
    this.addedProducts = this.addedProducts.filter((p) => p !== product);
  }

  resetSelected(): void {
    this.selectedProductId = this.remainedProducts[0]?.id;
  }

  printCategories(product: IProduct): string {
    return product.categories.map((c) => c.name).join(', ');
  }
}
