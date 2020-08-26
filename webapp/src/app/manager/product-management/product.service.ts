import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { SERVER_URL } from './../../core/constants/api.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../category-management/category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private REQUEST_URL = SERVER_URL + '/products/';

  public updateSubject = new Subject();
  public updateObservable$ = this.updateSubject.asObservable();

  constructor(private http: HttpClient) { }

  fetchProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.REQUEST_URL);
  }

  fetchProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(this.REQUEST_URL + id);
  }

  save(body: IProductBody): Observable<IProduct> {
    return this.http.post<IProduct>(SERVER_URL + '/manager/products', body);
  }

  update(id: number, body: IProductBody): Observable<IProduct> {
    return this.http.put<IProduct>(SERVER_URL + `/manager/products/${id}`, body);
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete<any>(SERVER_URL + `/manager/products/${id}`);
  }
}

export interface IProduct {
  id: number;
  name: string;
  price: number;
  // Quantity in warehouser
  quantity: number;
  // Quantity in store
  storeName?: string;
  storeProductQuantity?: number;
  createdAt?: number;
  categories?: ICategory[],
  categoryNames?: string[],
  imgUrl?: string;
  productId?: number;
  cartItemId?: number;
  storeId?: number;
}

export interface IProductBody {
  name: string;
  price: number;
  quantity?: number;
  storeId?: number;
  categories: number[]
}
