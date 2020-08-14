import { IProduct } from './../manager/product-management/product.service';
import { ICategory } from './../manager/category-management/category.service';
import { Observable } from 'rxjs';
import { SERVER_URL } from './../core/constants/api.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaymentInfo } from './payment-modal.service';
import { IUser } from '../core/auth/user.service';

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
    search = ""
  ): Observable<IPageableProduct> {
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

  removeCartItem(cartItemId: number): Observable<any> {
    return this.http.delete<any>(
      this.REQUEST_URL + `cart/cart-items/${cartItemId}`
    );
  }

  clearCart(cartId: number): Observable<any> {
    return this.http.delete<any>(this.REQUEST_URL + `cart/${cartId}`);
  }

  // PAYMENT
  checkoutPayment(body: IPaymentInfo): Observable<any> {
    return this.http.post<any>(this.REQUEST_URL + 'payment', body);
  }

  // ORDERS
  fetchOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.REQUEST_URL + 'orders');
  }

  updateOrderStatus(id: number, body: { status: string }): Observable<IOrder> {
    return this.http.put<IOrder>(
      this.REQUEST_URL + `orders/${id}/status`,
      body
    );
  }
}

export interface IPageableProduct {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
  products: IProduct[];
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
  productId?: number;
  storeId?: number;
  storeName?: string;
}

export interface ICartItemBody {
  idCartItem: number;
  quantity: number;
}

export interface IMergeCartBody {
  productId: number;
  quantity: number;
  storeId: number;
}

export interface IOrder {
  id: number;
  totalPrice: number;
  createdAt: number;
  phone: string;
  shipAddress: string;
  transactionId: string;
  status: string;
}

export interface IProductFilter {
  params: {
    storeId: number;
    categoryId: number;
  };
  query?: {
    page: number;
    size?: number;
    search?: string;
  };
}

export interface ICustomerBody {
  name: string;
  email: string;
  address: string;
  username: string;
  password: string;
}
