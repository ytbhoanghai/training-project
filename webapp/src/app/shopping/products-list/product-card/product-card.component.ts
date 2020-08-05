import { CartService } from './../../../service/cart.service';
import { IProduct } from './../../../manager/product-management/product.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  @Input() product: IProduct;
  isOutOfStock: boolean = false;
  imgId: number;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.imgId = this.randomImgId();
  }

  addToCart(): void {
    this.cartService.addItem(this.product);
  }

  randomImgId(): number {
    return Math.round(Math.random() * 50);
  }
}
