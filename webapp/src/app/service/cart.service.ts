import { NotificationService } from 'src/app/layouts/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IProduct } from './../manager/product-management/product.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './../core/auth/user.service';
import {
  CustomerService,
  ICart,
  ICartItem,
  ICartItemBody,
  IMergeCartBody,
} from './customer.service';
import { LocalCartService } from './local-cart.service';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: ICart = { totalPrice: 0, items: [] };

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
    }

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
    const body: IMergeCartBody[] = this.localCartService
      .getItems()
      .map((item) => ({ idProduct: item.id, quantity: item.quantity }));

    this.customerService.mergeCart(body).subscribe((failedIds: number[]) => {
      if (!failedIds.length) {
        this.notiService.showQuickSuccess('Merged');
        this.doAfterMerge();
      } else {
        console.log(failedIds);
        this.showMergeFailedMessage(failedIds);
        this.doAfterMerge();
      }
    });
  }

  doAfterMerge(): void {
    this.localCartService.clear();
    this.fetchRemoteCart();
    this.doPostClearCart();
  }

  showMergeFailedMessage(failedIds: number[]): void {
    failedIds.map((id) => {
      const item = this.cart.items.find((item) => item.id === id);
      this.notiService.showWaring(`${item.name} is out stock`);
    });
  }

  addItem(product: IProduct, quantity = 1): boolean {
    // Item id and product in cart id are not same
    product.productId = product.id;

    if (!this.userService.isLogin()) {
      this.localCartService.addItem(product);
      this.doPostAddded(product);
      return true;
    }

    this.customerService.addItemToCart(product.id, quantity).subscribe(
      (item) => {
        // This is cart item, not product
        this.doPostAddded({ ...item, productId: product.id });
      },
      (err: HttpErrorResponse) => {
        if (err.status === 406) {
          this.notiService.showWaring(
            `Reach maximum quantity. This product is out of stock`
          );
        }
      }
    );
  }

  doPostAddded(item: IProduct): void {
    this.checkExistedAndUpdateItemInCart(item);
    this.notiService.showQuickSuccess('Add item successfully!');
    this.changeEvent.next(this.cart);
  }

  checkExistedAndUpdateItemInCart(item: ICartItem): void {
    const index = this.cart.items.findIndex((elem) => elem.id === item.id);
    if (index >= 0) {
      const cartItem = this.cart.items[index];
      this.cart.items[index] = {
        ...cartItem,
        quantity: cartItem.quantity + 1,
      };
    } else {
      this.cart.items.push(item);
    }
  }

  updateItems(body: ICartItemBody[]): void {
    if (!body.length) {
      return this.notiService.showQuickWarning('Nothing has change!');
    }

    if (!this.userService.isLogin()) {
      this.localCartService.updateItems(body);
      this.notiService.showQuickSuccess('Cart updated successfully!');
      return;
    }

    this.customerService
      .updateCartItemQuantity(body)
      .subscribe((failedIds: number[]) => {
        console.log('failedIds', failedIds);
        if (!failedIds.length) {
          this.notiService.showQuickSuccess('Cart updated successfully!');
        } else {
          failedIds.map((id) => {
            const item = this.cart.items.find((item) => item.id === id);
            this.notiService.showWaring(`${item.name} is out of stock`);
          });
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

  clearCart(id: number): void {
    if (!this.userService.isLogin()) {
      this.localCartService.clear();
      this.doPostClearCart();
      return;
    }

    this.customerService.clearCart(id).subscribe(() => {
      this.doPostClearCart();
    });
  }

  doPostClearCart(): void {
    this.cart.items = [];
    this.changeEvent.next(this.cart);
    this.notiService.showQuickSuccess('Clear cart successfully!');
  }

  clearLocalCart(): void {
    this.localCartService.clear();
    this.cart.items = [];
    this.changeEvent.next(this.cart);
  }
}
