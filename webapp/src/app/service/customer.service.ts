import { IProduct } from './../manager/product-management/product.service';
import { ICategory } from './../manager/category-management/category.service';
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

  fetchProductsByStoreAndCategory(storeId: number, categoryId: number): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(
      this.REQUEST_URL + `stores/${storeId}/categories/${categoryId}/products`
    );
  }

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

  clearCart(cartId: number): Observable<any> {
    return this.http.delete<any>(this.REQUEST_URL + `cart/${cartId}`);
  }
}

export interface IShoppingProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
  storeName: string;
  categoryNames: string[];
}

export interface ICart {
  id?: number;
  createdAt?: number;
  totalPrice?: number;
  items: ICartItem[];
}

export interface ICartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  storeProductQuantity?: number;
  createdAt?: number;
  categories?: ICategory[];
}

export interface ICartItemBody {
  idCartItem: number;
  quantity: number;
}
