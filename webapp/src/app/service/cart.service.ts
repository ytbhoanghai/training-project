import { NotificationService } from 'src/app/layouts/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IProduct } from 'src/app/core/models';
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

  outStockEvent = new BehaviorSubject<number>(null);
  outStockListener$ = this.outStockEvent.asObservable();

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
      .map((item) => ({ productId: item.id, quantity: item.quantity, storeId: item.storeId }));

    this.customerService.mergeCart(body).subscribe((failedIds: number[]) => {
      if (!failedIds.length) {
        this.notiService.showQuickSuccess('Merged');
        this.doAfterMerge();
      } else {
        console.log(failedIds);
        this.showMergeFailedMessage(failedIds);
        this.doAfterMerge();
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 409) {
        const failedId: number[] = JSON.parse(err.error.message);
        failedId.forEach(id => {
          const cartItem = this.getCart().items.find(i => i.productId === id);
          this.notiService.showWaring(`${cartItem.name} is not in same store`);
        })
        this.fetchRemoteCart();
      }
      this.localCartService.clear();
    });
    this.localCartService.clear();
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

  addItem(product: IProduct, quantity = 1): void {
    if (!this.isValidItem(product)) return;

    // Item id and product in cart id are not same
    if (!this.userService.isLogin()) {
      product.quantity = quantity;

      this.localCartService.addItem(product);
      this.doPostAddded(product);
      return;
    }

    this.customerService
      .addItemToCart(product.storeId, product.id, quantity)
      .subscribe(
        (item) => {
          // Quantity from the user input
          this.doPostAddded({ ...item, quantity: quantity });
        },
        (err: HttpErrorResponse) => {
          if (err.status === 406) {
            // this.outStockEvent.next(product.productId);
            this.notiService.showWaring(
              `Reach maximum quantity. This product is out of stock`
            );
          }
        }
      );
  }

  isValidItem(product: IProduct): boolean {
    // CHECK SOLD OUT
    if (!product.quantity) {
      this.notiService.showError('Product has sold out!');
      return false;
    }

    // CHECK SAME STORE
    const storeNameList = this.cart.items.map((i) => i.storeName);
    const isSameStore =
      !storeNameList.length || storeNameList.includes(product.storeName);
    if (!isSameStore) {
      this.notiService.showWaring(`Your order must be in the same ${storeNameList[0]} store!`);
      return false;
    }

    // CHECK QUANTITY
    const cartItem = this.cart.items.find(i => i.productId === product.id);
    if (cartItem && cartItem.quantity >= product.quantity) {
      this.notiService.showWaring( `Reach maximum quantity. This product is out of stock`);
      this.outStockEvent.next(product.productId);
      return false;
    }

    return true;
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
        quantity: cartItem.quantity + item.quantity,
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
    // Remove out of stock label
    const cartItem = this.cart.items.find(i => i.id === id);
    this.outStockEvent.next(-cartItem.productId);

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
  }

  clearLocalCart(): void {
    this.localCartService.clear();
    this.cart.items = [];
    this.changeEvent.next(this.cart);
  }
}
