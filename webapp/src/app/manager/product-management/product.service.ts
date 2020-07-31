import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { SERVER_URL } from './../../core/constants/api.constants';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  storeProductQuantity: number;
  createdAt: number;
  categories: ICategory[]
}

export interface IProductBody {
  name: string;
  price: number;
  categories: number[]
}
