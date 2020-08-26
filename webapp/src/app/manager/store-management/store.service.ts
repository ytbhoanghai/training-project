import { IUser } from 'src/app/core/auth/user.service';
import { IProduct } from './../product-management/product.service';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SERVER_URL } from '../../core/constants/api.constants';
import { Observable } from 'rxjs';
import { ICategory } from '../category-management/category.service';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private ADMIN_URL: string = SERVER_URL + '/admin/stores/';
  private MANAGER_URL: string = SERVER_URL + '/manager/stores/';

  addedSubject = new Subject<IProduct>();
  addedObservable$ = this.addedSubject.asObservable();

  updateSubject = new Subject();
  updateObservable$ = this.updateSubject.asObservable();

  importedSubject = new Subject<{ id: number; newQuan: number }>();
  importedObservable$ = this.importedSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchStores(): Observable<IStore[]> {
    return this.http.get<IStore[]>(this.ADMIN_URL.slice(0, -1));
  }

  fetchById(id: number): Observable<IStore> {
    return this.http.get<IStore>(this.ADMIN_URL + id);
  }

  fetchProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(SERVER_URL + '/manager/products');
  }

  // Deprecated
  fetchProductsByStoreId(storeId: number): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.ADMIN_URL + `${storeId}/products`);
  }

  // Deprecated
  fetchCategoriesByStoreId(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(SERVER_URL + '/manager/categories');
  }

  fetchStatusList(): Observable<string[]> {
    return this.http.get<string[]>(this.ADMIN_URL + 'status');
  }

  // Deprecated
  fetchAllStaffsInStore(storeId: number): Observable<IUser[]> {
    return this.http.get<IUser[]>(SERVER_URL + `/manager/staffs`);
  }

  // Deprecated
  fetchIfManagersByStoreId(
    storeId: number,
    isManager?: boolean
  ): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.ADMIN_URL + `${storeId}/staffs`, {
      params: new HttpParams().set('is_manager', String(isManager)),
    });
  }

  // Deprecated
  fetchProductByStoreAndIsAdded(
    id: number,
    isAdded: boolean
  ): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.ADMIN_URL + `${id}/products`, {
      params: new HttpParams().set('is_added', String(isAdded)),
    });
  }

  fetchManageableStores(): Observable<IStore[]> {
    return this.http.get<IStore[]>(this.MANAGER_URL);
  }

  save(body: IStore): Observable<IStore> {
    return this.http.post<IStore>(this.ADMIN_URL, body);
  }

  // Deprecated
  addProductWithQuantity(
    storeId: number,
    productId: number,
    quantity: number,
    isImport = false
  ): Observable<unknown> {
    return this.http.put<unknown>(
      SERVER_URL + `/stores/${storeId}/products/${productId}`,
      null,
      {
        params: {
          quantity: String(quantity),
          isImport: String(isImport),
        },
      }
    );
  }

  // Deprecated
  removeProduct(storeId: number, productId: number): Observable<unknown> {
    return this.http.delete<unknown>(
      this.ADMIN_URL + `${storeId}/products/${productId}`
    );
  }

  // Deprecated
  addStaffToStore(body: IUser): Observable<IUser> {
    return this.http.post<IUser>(SERVER_URL + `/manager/staffs`, body);
  }

  // Deprecated
  deleteStaffFromStore(storeId: number, staffId: number): Observable<unknown> {
    return this.http.delete<unknown>(
      SERVER_URL + `/manager/staffs/${staffId}`
    );
  }

  update(id: number, body: IStore): Observable<IStore> {
    return this.http.put<IStore>(this.ADMIN_URL + id, body);
  }

  deleteById(id: number): Observable<unknown> {
    return this.http.delete<unknown>(this.ADMIN_URL + id);
  }
}

export type ISimpleStaff = {
  id: number;
  name: string;
  email: string;
  isManager?: boolean;
  roles?: [
    {
      id: number;
      name: string;
      grantable: boolean;
      level: number;
      craetedAt: number;
    }
  ];
};

export type IStore = {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  status: StatusType;
  createdAt: number;
};

export enum StatusType {
  Closed,
  Open,
}
