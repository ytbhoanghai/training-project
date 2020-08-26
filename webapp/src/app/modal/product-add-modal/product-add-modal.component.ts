import { StoreService } from './../../manager/store-management/store.service';
import { ProductModalService } from './../../service/product-modal.service';
import {
  IProductBody,
  ProductService,
} from './../../manager/product-management/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-add-modal',
  templateUrl: './product-add-modal.component.html',
  styleUrls: ['./product-add-modal.component.css'],
})
export class ProductAddModalComponent implements OnInit {
  storeId: number;

  constructor(
    private productService: ProductService,
    private productModalService: ProductModalService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {}

  handleSubmit(body: IProductBody): void {
    body.storeId = this.storeId;
    this.productService.save(body).subscribe((product) => {
      console.log('Saved', product);
      this.storeService.addedSubject.next(product);
      this.handleCancel();
    });
  }

  handleCancel(): void {
    this.productModalService.hideAddModal();
  }
}
