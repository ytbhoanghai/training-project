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
  isOutOfStock = false;
  imgId: number;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.imgId = this.randomImgId();
  }

  addToCart(): void {
    this.cartService.addItem({...this.product, quantity: 1});
  }

  randomImgId(): number {
    return Math.round(Math.random() * 50);
  }
}
