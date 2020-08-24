import { ConfirmModalService } from './../../service/confirm-modal.service';
import { ProductModalService } from './../../service/product-modal.service';
import { NotificationService } from './../../layouts/notification/notification.service';
import { IProduct, ProductService } from './product.service';
import { Component, OnInit } from '@angular/core';
import {ClassGetter} from "@angular/compiler/src/output/output_ast";

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  products: IProduct[] = [];

  constructor(
    private productService: ProductService,
    private notiService: NotificationService,
    private productModalService: ProductModalService,
    private confirmService: ConfirmModalService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.productService.updateObservable$.subscribe((product: IProduct) => {
      const index: number = this.products.findIndex((p) => p.id === product.id);
      this.products[index] = product;
    });
  }

  fetchProducts(): void {
    this.productService.fetchProducts().subscribe((products) => {
      this.products = products;
    });
    // this.productService.fetchProductsPageable().subscribe(res => {
    //   console.log(res)
    //   this.products = res.content;
    // })
  }

  showDetailsModal(id: number): void {
    this.productService.fetchProductById(id).subscribe((product) => {
      this.productModalService.showDetailsModal(product);
    });
  }

  showUpdateModal(id: number): void {
    this.productService.fetchProductById(id).subscribe((product) => {
      this.productModalService.showUpdateModal(product);
    });
  }

  deleteProduct(id: number): void {
    this.confirmService.show();
    this.confirmService.onYes(() => {
      this.productService.deleteById(id).subscribe(() => {
        this.products = this.products.filter((store) => store.id !== id);
        this.notiService.showSuccess('Delete successfully!');
      });
    });
  }

  getCategories(product: IProduct): string {
    return product.categories.map((c) => c.name).join(', ');
  }
}
