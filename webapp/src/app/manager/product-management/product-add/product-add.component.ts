import { NotificationService } from 'src/app/layouts/notification/notification.service';
import { IProductBody, ProductService } from './../product.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css'],
})
export class ProductAddComponent implements OnInit {
  constructor(
    private location: Location,
    private productService: ProductService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {}

  handleSubmit(body: IProductBody): void {
    this.productService.save(body).subscribe(product => {
      this.notiService.showSuccess();
      this.back();
    });
  }

  back(): void {
    this.location.back();
  }
}
