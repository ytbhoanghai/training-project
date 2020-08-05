import {ICartItem, LocalCartService} from './../../service/local-cart.service';
import {Component, OnInit} from '@angular/core';
import {CartService} from "../../service/cart.service";

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})
export class CartDetailComponent implements OnInit {
  items: ICartItem[] = [];

  constructor(
    private localCartService: LocalCartService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.fetchLocalCart();
    // this.cartService.fetchCart();
    this.cartService.changeListener$.subscribe(cart => {
      console.log(cart);
    })
  }

  fetchLocalCart(): void {
    this.items = this.localCartService.getItems();
  }

}
