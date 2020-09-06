import { NotificationService } from 'src/app/layouts/notification/notification.service';
import { ProductModalService } from './../../service/product-modal.service';
import { ProductService } from '../../manager/product-management/product.service';
import { Component, OnInit, Input } from '@angular/core';
import { IProduct, IProductBody } from 'src/app/core/models';

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
    this.productService.update(id, body).subscribe((product) => {
      this.notiService.showSuccess();
      this.productModalService.hideUpdateModal();
      this.productService.updateSubject.next(product);
    });
  }

  hideModal(): void {
    this.productModalService.hideUpdateModal();
  }
}
