import { ConfirmModalService } from './../../service/confirm-modal.service';
import {
  ICart,
  ICartItem,
  ICartItemBody,
} from './../../service/customer.service';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css'],
})
export class CartDetailComponent implements OnInit {
  cart: ICart = { totalPrice: 0, items: [] };

  constructor(
    private cartService: CartService,
    private confirmService: ConfirmModalService
  ) {}

  ngOnInit(): void {
    this.cartService.fetchCart();
    this.cartService.changeListener$.subscribe((cart) => {
      this.cart = this.cartService.getCart();
      // this.cart = {...this.cartService.getCart(), items: [...this.cart.items]};
    });
  }

  removeCartItem(id: number): void {
    this.cartService.removeItem(id);
  }

  updateCart(): void {
    let body: ICartItemBody[] = [];
    this.cart.items.forEach((item) => {
      body.push({ idCartItem: item.id, quantity: item.quantity });
    });

    this.cartService.updateItems(body);
  }

  handleItemChanged(newItem: ICartItem): void {
    const index = this.cart.items.findIndex((item) => item.id === newItem.id);
    this.cart.items[index] = newItem;
    this.updateTotalPrice();
  }

  updateTotalPrice(): void {
    this.cart.totalPrice = this.cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  clearCart(): void {
    this.confirmService.show().onYes(() => {
      this.cartService.clearCart(this.cart.id);
    });
  }
}
