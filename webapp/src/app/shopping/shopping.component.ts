import { Component, OnInit } from '@angular/core';
import {IProduct, ProductService} from "../manager/product-management/product.service";

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {
  products: IProduct[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.fetchProducts().subscribe(products => {
      this.products = products;
    })
  }

  filterByCategory(id: number): void {
    console.log('filter category', id);
  }

}
