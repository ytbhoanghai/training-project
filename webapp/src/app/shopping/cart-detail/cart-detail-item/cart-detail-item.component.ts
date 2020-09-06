import { CartService } from './../../../service/cart.service';
import { ICartItem } from 'src/app/core/models';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '[app-cart-detail-item]',
  templateUrl: './cart-detail-item.component.html',
  styleUrls: ['./cart-detail-item.component.css'],
})
export class CartDetailItemComponent implements OnInit {
  @Input() item: ICartItem;

  quantity: number;
  @Output() onItemChanged = new EventEmitter();

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.quantity = this.item.quantity;
  }

  incQuantity(): void {
    this.quantity = +this.quantity + 1;
    this.emitItemChanged();
  }

  desQuantity(): void {
    if (this.quantity <= 1) return;
    this.quantity = +this.quantity - 1;
    this.emitItemChanged();
  }

  onChange(): void {
    this.onItemChanged.emit({ ...this.item, quantity: this.quantity });
  }

  emitItemChanged(): void {
    this.onItemChanged.emit({ ...this.item, quantity: this.quantity });
  }

  removeCartItem(id: number): void {
    this.cartService.removeItem(id);
  }
}
