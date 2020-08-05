import { ICart } from './../../service/customer.service';
import { CartService } from './../../service/cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-checkout',
  templateUrl: './cart-checkout.component.html',
  styleUrls: ['./cart-checkout.component.css'],
})
export class CartCheckoutComponent implements OnInit {
  cart: ICart = { totalPrice: 0, items: [] };

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.fetchCart();
    this.cartService.changeListener$.subscribe((cart) => {
      this.cart = this.cartService.getCart();
    });
  }
}
