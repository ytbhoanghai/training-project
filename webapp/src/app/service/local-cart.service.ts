import { IProduct } from 'src/app/core/models';
import { Injectable } from '@angular/core';
import { ICart, ICartItem, ICartItemBody } from './customer.service';

@Injectable({
  providedIn: 'root',
})
export class LocalCartService {
  private cartName = 'tps_training_user_cart';
  private defaultCart: ICart = {
    totalPrice: 0,
    items: [],
  };

  constructor() {}

  getCart(): ICart {
    if (this.isEmpty()) return this.defaultCart;

    const cart: ICart = JSON.parse(localStorage.getItem(this.cartName));
    return cart;
  }

  getItems(): ICartItem[] {
    if (this.isEmpty()) return [];

    const cart: ICart = JSON.parse(localStorage.getItem(this.cartName));
    return cart.items;
  }

  addItem(item: IProduct): void {
    const items: ICartItem[] = this.getItems();
    const index = items.findIndex((elem) => elem.id === item.id);

    // FOUND
    if (index >= 0) {
      items[index] = { ...items[index], quantity: items[index].quantity + item.quantity };
      // NOT FOUND
    } else {
      const newItem: ICartItem = { ...item, quantity: item.quantity};
      items.push(newItem);
    }

    this.save(items);
  }

  save(items: ICartItem[]): void {
    const totalPrice = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const cart: ICart = { totalPrice, items };
    localStorage.setItem(this.cartName, JSON.stringify(cart));
  }

  updateItems(items: ICartItemBody[]): void {
    const cartItems = this.getItems();
    items.map((item) => {
      const index = cartItems.findIndex((i) => i.id === item.idCartItem);
      cartItems[index] = { ...cartItems[index], quantity: item.quantity };
    });
    this.save(cartItems);
  }

  deleteItemById(id: number): void {
    const items = this.getItems().filter((item) => item.id !== id);
    this.save(items);
  }

  isEmpty(): boolean {
    if (!localStorage.getItem(this.cartName)) return true;

    const cart: ICart = JSON.parse(localStorage.getItem(this.cartName));
    return cart.items && !cart.items.length;
  }

  clear(): void {
    localStorage.removeItem(this.cartName);
  }
}
