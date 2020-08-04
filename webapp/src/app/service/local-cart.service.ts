import { ICategory } from './../manager/category-management/category.service';
import { Subject } from 'rxjs';
import { IProduct } from './../manager/product-management/product.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalCartService {
  events = {
    add: new Subject(),
    update: new Subject(),
    delete: new Subject(),
    change: new Subject(),
  };

  listeners = {
    onAdd: this.events.add.asObservable(),
    onUpdate: this.events.update.asObservable(),
    onDelete: this.events.delete.asObservable(),
    onChange: this.events.change.asObservable(),
  };

  private cartName: string = 'tps_training_user_cart';
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

  getItems(): IProduct[] {
    if (this.isEmpty()) return [];

    const cart: ICart = JSON.parse(localStorage.getItem(this.cartName));
    return cart.items;
  }

  addItem(item: IProduct): void {
    let items: IProduct[] = this.getItems();
    let index = items.findIndex((elem) => elem.id === item.id);

    // FOUND
    if (index >= 0) {
      items[index] = { ...items[index], quantity: items[index].quantity + 1 };
      // NOT FOUND
    } else {
      items.push({ ...item, quantity: 1 });
    }

    this.save(items);
  }

  save(items: IProduct[]): void {
    const totalPrice = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const cart: ICart = { totalPrice, items };
    localStorage.setItem(this.cartName, JSON.stringify(cart));
    // Emit change event on saved
    this.events.change.next();
  }

  deleteItemById(id: number): void {
    let items = this.getItems().filter((item) => item.id !== id);
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

export interface ICart {
  id?: number;
  createdAt?: number;
  totalPrice?: number;
  items: IProduct[];
}

export interface ICartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  storeProductQuantity?: number;
  createdAt?: number;
  categories?: ICategory[]
}
