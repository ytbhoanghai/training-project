import { ConfirmModalComponent } from './../../modal/confirm-modal/confirm-modal.component';
import { MDBModalRef } from 'ng-uikit-pro-standard';
import { ConfirmModalService } from './../../service/confirm-modal.service';
import { ProductModalService } from './../../service/product-modal.service';
import { NotificationService } from './../../layouts/notification/notification.service';
import { IProduct, ProductService } from './product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  products: IProduct[] = [];
  confirmModalRef: MDBModalRef;

  constructor(
    private productService: ProductService,
    private notiService: NotificationService,
    private productModalService: ProductModalService,
    private confirmService: ConfirmModalService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.productService.updateObservable$.subscribe((product: IProduct) => {
      const index: number = this.products.findIndex(p => p.id === product.id);
      this.products[index] = product;
    })
  }

  fetchProducts(): void {
    this.productService.fetchProducts().subscribe((products) => {
      this.products = products;
    });
  }

  showDetailsModal(id: number) {
    this.productService.fetchProductById(id).subscribe(product => {
      this.productModalService.showDetailsModal(product);
    })
  }

  showUpdateModal(id: number) {
    this.productService.fetchProductById(id).subscribe(product => {
      this.productModalService.showUpdateModal(product);
    })
  }

  deleteProduct(id: number) {
    // this.confirmModalRef = this.confirmService.show('DeleteProduct');
    // this.confirmModalRef.content.action.subscribe(({ value, key }) => {
    //   if (key === 'DeleteProduct' && value === ConfirmModalComponent.YES) {
    //     this.productService.deleteById(id).subscribe(() => {
    //       this.products = this.products.filter(store => store.id !== id);
    //       this.notiService.showSuccess('Delete successfully!');
    //     })
    //     this.confirmModalRef.hide();
    //   }
    // })
    this.confirmService.show();
    this.confirmService.onYes(() => {
      console.log("YES")
    })
  }

  getCategories(product: IProduct) {
    return product.categories.map(c => c.name).join(", ");
  }
}
