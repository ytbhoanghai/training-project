import { ConfirmModalService } from './../../../service/confirm-modal.service';
import { NotificationService } from 'src/app/layouts/notification/notification.service';
import { StoreService } from './../../../manager/store-management/store.service';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from './../../../manager/product-management/product.service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-store-product',
  templateUrl: './store-product.component.html',
  styleUrls: ['./store-product.component.css'],
})
export class StoreProductComponent implements OnInit {
  addedProducts: IProduct[] = [];
  remainedProducts: IProduct[] = [];

  storeId: number;
  selectedProductId: number;
  quantity = 1;

  constructor(
    private storeService: StoreService,
    private route: ActivatedRoute,
    private notiService: NotificationService,
    private confirmService: ConfirmModalService
  ) {}

  ngOnInit(): void {
    this.storeId = this.route.snapshot.params.id;
    this.fetchProducts();
  }

  fetchProducts(): void {
    // Fetch added products
    this.storeService
      .fetchProductByStoreAndIsAdded(this.storeId, true)
      .subscribe((products) => {
        this.addedProducts = products;
      });

    // Fetch can add products
    this.storeService
      .fetchProductByStoreAndIsAdded(this.storeId, false)
      .subscribe((products) => {
        this.remainedProducts = products;
        this.resetSelected();
      });
  }

  addProduct(): void {
    const product: IProduct = this.remainedProducts.find(
      (p) => p.id === this.selectedProductId
    );
    // Exit on error
    if (!product) return;

    // Add to API
    this.storeService
      .addProductWithQuantity(
        this.storeId,
        this.selectedProductId,
        this.quantity
      )
      .subscribe(
        () => this.addProductInUI(product),
        (err: HttpErrorResponse) => {
          if (err.status === 406) {
            this.notiService.showError('Not enough product in store!');
          }
        }
      );
  }

  // Update product list in UI
  addProductInUI(product: IProduct): void {
    this.addedProducts.push({
      ...product,
      storeProductQuantity: this.quantity,
    });
    this.remainedProducts = this.remainedProducts.filter(
      (p) => p.id !== this.selectedProductId
    );
    this.resetSelected();
    this.notiService.showSuccess();
  }

  removeProduct(product: IProduct): void {
    this.confirmService.show().onYes(() => {
      this.remainedProducts.push(product);
      this.addedProducts = this.addedProducts.filter((p) => p !== product);
      this.resetSelected();

      // Remove from API
      this.storeService.removeProduct(this.storeId, product.id).subscribe(
        () => this.notiService.showSuccess(),
        (err: HttpErrorResponse) => this.notiService.showError401(err.message)
      );
    });
  }

  resetSelected(): void {
    this.selectedProductId = this.remainedProducts[0]?.id;
    this.quantity = 1;
  }

  printCategories(product: IProduct): string {
    return product.categories.map((c) => c.name).join(', ');
  }
}
