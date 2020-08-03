import { IProduct } from './../manager/product-management/product.service';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class LocalCartService {
  private cookieName: string = 'tps_training_user_cart';

  constructor(private cookieService: CookieService) {}

  getItems(): IProduct[] {
    if (this.isEmpty()) return [];

    const items: IProduct[] = JSON.parse(
      this.cookieService.get(this.cookieName)
    );
    return items;
  }

  addItem(item: IProduct): void {
    let items: IProduct[] = this.getItems();
    let index = items.findIndex((elem) => elem.id === item.id);

    // FOUND
    if (index >= 0) {
      items[index] = { ...items[index], quantity: items[index].quantity + 1 };
    // NOT FOUND
    } else {
      items.push({...item, quantity: 1});
    }

    this.save(items);
  }

  save(items: IProduct[]): void {
    this.cookieService.set(this.cookieName, JSON.stringify(items));
  }

  deleteItemById(id: number): void {
    let items = this.getItems();
    items.filter((item) => item.id !== id);
    this.save(items);
  }

  isEmpty(): boolean {
    if (!this.cookieService.check(this.cookieName)) return true;

    const items: IProduct[] = JSON.parse(
      this.cookieService.get(this.cookieName)
    );
    return !items && Boolean(items.length);
  }

  clear(): void {
    this.cookieService.delete(this.cookieName);
  }
}

export interface ICart {
  totalPrice: number;
  items: ICartItem[];
}

export interface ICartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}
