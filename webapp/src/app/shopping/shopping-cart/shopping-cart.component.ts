import { IProduct } from './../../manager/product-management/product.service';
import { LocalCartService } from './../../service/local-cart.service';
import { Component, OnInit } from '@angular/core';
import { toArray } from 'rxjs/operators';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  items: IProduct[] = [];
  totalPrice: number;

  constructor(private localCartService: LocalCartService) {}

  ngOnInit(): void {
    this.fetchLocalCart();
  }

  fetchLocalCart(): void {
    this.items = this.localCartService.getItems();
    console.log(this.items);
    this.totalPrice = this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}
