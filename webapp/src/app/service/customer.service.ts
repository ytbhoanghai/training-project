import { Observable } from 'rxjs';
import { SERVER_URL } from './../core/constants/api.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private REQUEST_URL = SERVER_URL + '/customer/';

  constructor(private http: HttpClient) {}

  getMyCart(): Observable<ICart> {
    return this.http.get<ICart>(this.REQUEST_URL + 'cart');
  }

  addItemToCart(productId: number, quantity: number): Observable<ICartItem> {
    return this.http.put<ICartItem>(this.REQUEST_URL + 'cart', null, {
      params: {
        productId: String(productId),
        quantity: String(quantity),
      },
    });
  }

  updateCartItemQuantity(body: ICartItemBody[]): Observable<number[]> {
    return this.http.put<number[]>(this.REQUEST_URL + 'cart/cart-items', body);
  }

  removeCartItem(cartItemId: number): Observable<any> {
    return this.http.delete<any>(
      this.REQUEST_URL + `cart/cart-items/${cartItemId}`
    );
  }
}

export interface ICart {
  id: number;
  createdAt?: number;
  totalPrice?: number;
  items: ICartItem[];
}

export interface ICartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ICartItemBody {
  idCartItem: number;
  quantity: number;
}