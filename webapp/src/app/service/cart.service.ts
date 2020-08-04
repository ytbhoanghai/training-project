import { HttpErrorResponse } from '@angular/common/http';
import { IProduct } from './../manager/product-management/product.service';
import { Subject } from 'rxjs';
import { UserService } from './../core/auth/user.service';
import { CustomerService, ICart, ICartItem } from './customer.service';
import { LocalCartService } from './local-cart.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: ICart;

  changeEvent = new Subject<ICart>();
  changeListener = this.changeEvent.asObservable();

  constructor(
    private localCartService: LocalCartService,
    private customerService: CustomerService,
    private userService: UserService
  ) {}

  getCart(): ICart {
    return this.cart;
  }

  fetchCart(): void {
    if (!this.userService.isLogin()) return;

    if (this.localCartService.isEmpty()) {
      this.fetchRemoteCart();
    } else {
      this.mergeCart();
    }
  }

  fetchRemoteCart(): void {
    console.log('FETCHING CART');
    this.customerService.getMyCart().subscribe((cart) => {
      this.cart = cart;
      this.changeEvent.next(cart);
    });
  }

  mergeCart(): void {
    console.log('START MERGING CART');
    this.localCartService.getItems().map((item) => {
      this.customerService
        .addItemToCart(item.id, item.quantity)
        .subscribe(null, (err) => console.log('Error on merge'));
    });
    this.localCartService.clear();
  }

  addItem(item: IProduct): void {
    if (!this.userService.isLogin()) {
      this.localCartService.addItem(item);
      return;
    }

    // Default quantity at 1
    this.customerService.addItemToCart(item.id, 1).subscribe(
      (item) => {
        this.localCartService.events.add.next(item);
        // this.notiService.showSuccess();
      },
      (err: HttpErrorResponse) => {
        if (err.status === 406) {
          // this.notiService.showWaring(
          //   `Reach maximum ${this.product.quantity} items. This product is out of stock`
          // );
        }
      }
    );
  }
}
