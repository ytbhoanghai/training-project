import { Subscription } from 'rxjs';
import { ProductModalService } from './../../../service/product-modal.service';
import { ProductImportModalService } from './../../../service/product-import-modal.service';
import { ConfirmModalService } from './../../../service/confirm-modal.service';
import { NotificationService } from 'src/app/layouts/notification/notification.service';
import { StoreService } from './../../../manager/store-management/store.service';
import { ActivatedRoute } from '@angular/router';
import { IProduct, ProductService } from './../../../manager/product-management/product.service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-store-product',
  templateUrl: './store-product.component.html',
  styleUrls: ['./store-product.component.css'],
})
export class StoreProductComponent implements OnInit {
  listeners: Subscription;

  addedProducts: IProduct[] = [];
  remainedProducts: IProduct[] = [];

  storeId: number;
  selectedProductId: number;
  quantity = 1;

  constructor(
    private storeService: StoreService,
    private route: ActivatedRoute,
    private notiService: NotificationService,
    private confirmService: ConfirmModalService,
    private productImportModalService: ProductImportModalService,
    private productModalService: ProductModalService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.storeId = this.route.parent.snapshot.params.id;
    this.fetchProducts();

    this.storeService.importedObservable$.subscribe(({ id, newQuan }) => {
      const index = this.addedProducts.findIndex((p) => p.id === id);
      // Add quantity
      const addedQuan =
        this.addedProducts[index].storeProductQuantity + newQuan;
      this.addedProducts[index].storeProductQuantity = addedQuan;
    });

    this.storeService.addedObservable$.subscribe((product) => {
      this.addedProducts.push(product);
    });

    this.productService.updateObservable$.subscribe((product: IProduct) => {
      const index: number = this.addedProducts.findIndex(p => p.id === product.id);
      this.addedProducts[index] = product;
    })
  }

  fetchProducts(): void {
    // // Fetch added products
    // this.storeService
    //   .fetchProductByStoreAndIsAdded(this.storeId, true)
    //   .subscribe((products) => {
    //     this.addedProducts = products;
    //   });

    // // Fetch can add products
    // this.storeService
    //   .fetchProductByStoreAndIsAdded(this.storeId, false)
    //   .subscribe((products) => {
    //     this.remainedProducts = products;
    //     this.resetSelected();
    //   });
    this.storeService
      .fetchProductsByStoreId(this.storeId)
      .subscribe((products) => {
        this.addedProducts = products;
      });
  }

  addProduct(): void {
    const product: IProduct = this.remainedProducts.find(
      (p) => p.id === this.selectedProductId
    );
    // Exit on error
    if (!product) {
      return this.notiService.showWaring('Empty product list');
    }

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
      // Remove from API
      this.productService.deleteById(product.id).subscribe(
        () => {
          this.remainedProducts.push(product);
          this.addedProducts = this.addedProducts.filter((p) => p !== product);
          this.resetSelected();
          this.notiService.showSuccess();
        },
        (err: HttpErrorResponse) => this.notiService.showError401(err.message)
      );
    });
  }

  resetSelected(): void {
    this.selectedProductId = this.remainedProducts[0]?.id || 0;
    this.quantity = 1;
  }

  printCategories(product: IProduct): string {
    return product.categories.map((c) => c.name).join(', ');
  }

  showImportModal(product: IProduct): void {
    product.storeId = this.storeId;
    this.productImportModalService.show(product);
  }

  showAddModal(): void {
    this.productModalService.showAddModal(this.storeId);
  }

  showUpdateModal(product: IProduct): void {
    this.productModalService.showUpdateModal(product);
  }
}
