import { ProductModalService } from './../../service/product-modal.service';
import { IProduct } from 'src/app/core/models';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;

  constructor(private productModalService: ProductModalService) {}

  ngOnInit(): void {}

  hideModal(): void {
    this.productModalService.hideDetailsModal();
  }

  getCategories(): string {
    return this.product.categories.map((m) => m.name).join(', ');
  }
}
