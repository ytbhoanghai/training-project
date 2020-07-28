import { NotificationService } from 'src/app/layouts/notification/notification.service';
import { ProductModalService } from './../../service/product-modal.service';
import {
  IProduct,
  IProductBody,
  ProductService,
} from './../../manager/product-management/product.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css'],
})
export class ProductUpdateComponent implements OnInit {
  product: IProduct;

  constructor(
    private productModalService: ProductModalService,
    private productService: ProductService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {}

  handleSubmit(id: number, body: IProductBody): void {
    this.productService.update(id, body).subscribe(product => {
      this.notiService.showSuccess();
      this.productModalService.hideUpdateModal();
    })
  }

  hideModal(): void {
    this.productModalService.hideUpdateModal();
  }
}
