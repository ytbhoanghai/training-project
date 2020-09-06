import {
  IPageableProduct,
  ICart,
  ICartItem,
  ICartItemBody,
  IMergeCartBody,
  IOrder,
  IMessageResponse,
} from 'src/app/core/models';
import { Observable } from 'rxjs';
import { SERVER_URL } from '../core/constants/api.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaymentInfo } from './payment-modal.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private REQUEST_URL = SERVER_URL + '/customer/';

  constructor(private http: HttpClient) {}

  fetchProductsByStoreAndCategory(
    storeId: number,
    categoryId = -1,
    page = 1,
    size = 9,
    search = ''
  ): Observable<IPageableProduct> {
    if (page < 1) page = 1;
    return this.http.get<IPageableProduct>(
      this.REQUEST_URL + `stores/${storeId}/categories/${categoryId}/products`,
      { params: { page: String(page), size: String(size), search: search } }
    );
  }

  getMyCart(): Observable<ICart> {
    return this.http.get<ICart>(this.REQUEST_URL + 'cart');
  }

  addItemToCart(
    storeId: number,
    productId: number,
    quantity: number
  ): Observable<ICartItem> {
    return this.http.put<ICartItem>(this.REQUEST_URL + 'cart', null, {
      params: {
        storeId: String(storeId),
        productId: String(productId),
        quantity: String(quantity),
      },
    });
  }

  updateCartItemQuantity(body: ICartItemBody[]): Observable<number[]> {
    return this.http.put<number[]>(this.REQUEST_URL + 'cart/cart-items', body);
  }

  mergeCart(body: IMergeCartBody[]): Observable<number[]> {
    return this.http.put<number[]>(
      this.REQUEST_URL + 'cart/cart-items/merge',
      body
    );
  }

  removeCartItem(cartItemId: number): Observable<IMessageResponse> {
    return this.http.delete<IMessageResponse>(
      this.REQUEST_URL + `cart/cart-items/${cartItemId}`
    );
  }

  clearCart(cartId: number): Observable<IMessageResponse> {
    return this.http.delete<IMessageResponse>(this.REQUEST_URL + `cart/${cartId}`);
  }

  // PAYMENT
  checkoutPayment(body: IPaymentInfo): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(this.REQUEST_URL + 'payment', body);
  }

  // ORDERS
  fetchOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.REQUEST_URL + 'orders');
  }

  fetchOrdersByStore(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(SERVER_URL + '/manager/orders');
  }

  updateOrderStatus(id: number, body: { status: string }): Observable<IOrder> {
    return this.http.put<IOrder>(
      this.REQUEST_URL + `orders/${id}/status`,
      body
    );
  }
}
