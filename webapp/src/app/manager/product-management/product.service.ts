import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { SERVER_URL } from '../../core/constants/api.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../category-management/category.service';
import {IPageableProduct} from "../../service/customer.service";

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

  fetchProductsPageable(page = 0, size = 15): Observable<IPageableProduct> {
    if (page < 0) page = 0;
    return this.http.get<IPageableProduct>(this.REQUEST_URL + 'pageable',
      { params: { page: String(page), size: String(size) } }
      );
  }

  fetchProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(this.REQUEST_URL + id);
  }

  save(body: IProductBody): Observable<IProduct> {
    return this.http.post<IProduct>(this.REQUEST_URL, body);
  }

  update(id: number, body: IProductBody): Observable<IProduct> {
    return this.http.put<IProduct>(this.REQUEST_URL + id, body);
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete<any>(this.REQUEST_URL + id);
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
  categories: number[]
}
