import { ICartItem } from './../../service/customer.service';
import { Router } from '@angular/router';
import { CartService } from './../../service/cart.service';
import { ShoppingModalService } from './../../service/shopping-modal.service';
import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/core/models';

@Component({
  selector: 'app-shopping-details',
  templateUrl: './shopping-details.component.html',
  styleUrls: ['./shopping-details.component.css'],
})
export class ShoppingDetailsComponent implements OnInit {
  product: IProduct;

  quantity = 1;
  addedQuantity = 0;

  constructor(
    private shoppingModalService: ShoppingModalService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.findAddedQuantity();
  }

  findAddedQuantity(): void {
    const items: ICartItem[] = this.cartService.getCart().items;
    const addedItem = items.find(item => item.productId === this.product.id);
    if (addedItem) {
      this.addedQuantity = addedItem.quantity;
    }
  }

  hideModal(): void {
    this.shoppingModalService.hide();
  }

  incQuantity(): void {
    if (this.quantity >= this.product.quantity - this.addedQuantity) return;
    this.quantity = +this.quantity + 1;
  }

  desQuantity(): void {
    if (this.quantity <= 1) return;
    this.quantity = +this.quantity - 1;
  }

  addToCart(): void {
    this.cartService.addItem(this.product, this.quantity);
    this.shoppingModalService.hide();
  }

  addToCartAndCheckout(): void {
    this.addToCart();
    this.router.navigate(['/shopping', 'cart']);
  }
}
