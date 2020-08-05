import { NotificationService } from 'src/app/layouts/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IProduct } from './../manager/product-management/product.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { UserService } from './../core/auth/user.service';
import {
  CustomerService,
  ICart,
  ICartItem,
  ICartItemBody,
  IShoppingProduct,
} from './customer.service';
import { LocalCartService } from './local-cart.service';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: ICart;

  changeEvent = new BehaviorSubject<ICart>(null);
  changeListener$ = this.changeEvent.asObservable();

  constructor(
    private localCartService: LocalCartService,
    private customerService: CustomerService,
    private userService: UserService,
    private notiService: NotificationService
  ) {}

  getCart(): ICart {
    this.cart.totalPrice = this.cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return this.cart;
  }

  fetchCart(): void {
    if (!this.userService.isLogin()) {
      this.cart = this.localCartService.getCart();
      this.changeEvent.next(this.cart);
      return;
    };

    if (this.localCartService.isEmpty()) {
      this.fetchRemoteCart();
    } else {
      this.mergeCart();
    }
  }

  fetchRemoteCart(): void {
    console.log('FETCHING CART');
    this.customerService
      .getMyCart()
      .pipe(take(1))
      .subscribe((cart) => {
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
      this.doPostAddded(item);
      return;
    }

    // Default quantity at 1
    this.customerService.addItemToCart(item.id, 1).subscribe(
      (item) => {
        this.doPostAddded(item);
      },
      (err: HttpErrorResponse) => {
        const currentProduct = this.cart.items.find(
          (elem) => elem.id === item.id
        );
        if (err.status === 406) {
          this.notiService.showWaring(
            `Reach maximum ${currentProduct?.quantity} items. This product is out of stock`
          );
        }
      }
    );
  }

  doPostAddded(item: IProduct): void {
    this.checkExistedAndUpdateItemInCart(item);
    this.changeEvent.next(this.cart);
    this.notiService.showQuickSuccess('Add item successfully!');
  }

  checkExistedAndUpdateItemInCart(item: ICartItem): void {
    const index = this.cart.items.findIndex((elem) => elem.id === item.id);
    if (index >= 0) {
      let cartItem = this.cart.items[index];
      this.cart.items[index] = {
        ...cartItem,
        quantity: cartItem.quantity + 1,
      };
    } else {
      this.cart.items.push(item);
    }
  }

  updateItems(body: ICartItemBody[]): void {
    this.customerService
      .updateCartItemQuantity(body)
      .subscribe((failedIds: number[]) => {
        console.log('failedIds', failedIds);
        if (!failedIds.length) {
          this.notiService.showQuickSuccess('Cart updated successfully!');
        } else {
          this.notiService.showWaring('Out of stock');
        }
      });
  }

  removeItem(id: number): void {
    if (!this.userService.isLogin()) {
      this.localCartService.deleteItemById(id);
      this.doPostRemoved(id);
      return;
    }

    this.customerService.removeCartItem(id).subscribe(() => {
      this.doPostRemoved(id);
    });
  }

  doPostRemoved(id: number): void {
      this.cart.items = this.cart.items.filter((item) => item.id !== id);
      this.changeEvent.next(this.cart);
      this.notiService.showQuickSuccess('Delete item successfully!');
  }
}
