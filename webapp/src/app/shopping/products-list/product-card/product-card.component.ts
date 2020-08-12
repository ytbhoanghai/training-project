import { ShoppingModalService } from './../../../service/shopping-modal.service';
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
  imgUrl: string;

  constructor(
    private cartService: CartService,
    private shoppingModalService: ShoppingModalService
  ) {}

  ngOnInit(): void {
    this.imgUrl = `https://picsum.photos/id/${this.randomImgId()}/400`;
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    this.cartService.addItem({ ...this.product, quantity: 1 });
  }

  randomImgId(): number {
    return Math.round(Math.random() * 50);
  }

  showProductModal(): void {
    this.shoppingModalService.show({ ...this.product, imgUrl: this.imgUrl });
  }
}
