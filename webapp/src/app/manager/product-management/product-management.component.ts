import { IProduct, ProductService } from './product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  products: IProduct[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.fetchProducts().subscribe(products => {
      this.products = products;
    })
  }

  showDetailsModal(id: number) {}

  showUpdateModal(id: number) {}

  deleteProduct(id: number) {}
}
