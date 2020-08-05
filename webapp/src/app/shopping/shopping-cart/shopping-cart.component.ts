import { ICart } from './../../service/customer.service';
import { CartService } from './../../service/cart.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  cart: ICart = { totalPrice: 0, items: [] };

  listener: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.fetchCart();
    this.listener = this.cartService.changeListener$.subscribe((cart) => {
      console.log("receive cart", cart)
      this.cart = this.cartService.getCart();
    });
  }

  ngOnDestroy(): void {
    this.listener.unsubscribe();
  }

  removeCartItem(id: number): void {
    this.cartService.removeItem(id);
  }
}
