import { IProduct } from './../../manager/product-management/product.service';
import { LocalCartService } from './../../service/local-cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})
export class CartDetailComponent implements OnInit {
  items: IProduct[] = [];

  constructor(private localCartService: LocalCartService) { }

  ngOnInit(): void {
    this.fetchLocalCart();
  }

  fetchLocalCart(): void {
    this.items = this.localCartService.getItems();
  }

}
