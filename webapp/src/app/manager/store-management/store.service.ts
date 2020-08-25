import { IProduct } from './../product-management/product.service';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SERVER_URL } from '../../core/constants/api.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private REQUEST_URL: string = SERVER_URL + '/stores/';

  addedSubject = new Subject<IProduct>();
  addedObservable$ = this.addedSubject.asObservable();

  updateSubject = new Subject();
  updateObservable$ = this.updateSubject.asObservable();

  importedSubject = new Subject<{id: number, newQuan: number}>();
  importedObservable$ = this.importedSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchStores(): Observable<IStore[]> {
    return this.http.get<IStore[]>(this.REQUEST_URL.slice(0, -1));
  }

  fetchById(id: number): Observable<IStore> {
    return this.http.get<IStore>(this.REQUEST_URL + id);
  }

  fetchProductsByStoreId(storeId: number): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.REQUEST_URL + `${storeId}/products/all`);
  }

  fetchStatusList(): Observable<string[]> {
    return this.http.get<string[]>(this.REQUEST_URL + 'status');
  }

  fetchAllStaffsInStore(storeId: number): Observable<ISimpleStaff[]> {
    return this.http.get<ISimpleStaff[]>(
      this.REQUEST_URL + `${storeId}/staffs`
    );
  }

  fetchIfManagersByStoreId(
    storeId: number,
    isManager?: boolean
  ): Observable<ISimpleStaff[]> {
    return this.http.get<ISimpleStaff[]>(
      this.REQUEST_URL + `${storeId}/staffs`,
      {
        params: new HttpParams().set('is_manager', String(isManager)),
      }
    );
  }

  fetchProductByStoreAndIsAdded(
    id: number,
    isAdded: boolean
  ): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.REQUEST_URL + `${id}/products`, {
      params: new HttpParams().set('is_added', String(isAdded)),
    });
  }

  fetchManageableStores(): Observable<IStore[]> {
    return this.http.get<IStore[]>(this.REQUEST_URL + 'management');
  }

  save(body: IStore): Observable<IStore> {
    return this.http.post<IStore>(this.REQUEST_URL, body);
  }

  addProductWithQuantity(
    storeId: number,
    productId: number,
    quantity: number,
    isImport = false
  ): Observable<any> {
    return this.http.put<any>(
      this.REQUEST_URL + `${storeId}/products/${productId}`,
      null,
      {
        params: {
          quantity: String(quantity),
          isImport: String(isImport)
        }
      }
    );
  }

  removeProduct(storeId: number, productId: number): Observable<any> {
    return this.http.delete<any>(
      this.REQUEST_URL + `${storeId}/products/${productId}`
    );
  }

  addStaffToStore(storeId: number, staffId: number): Observable<any> {
    return this.http.put<any>(this.REQUEST_URL + `${storeId}/staffs/${staffId}`, null);
  }

  deleteStaffFromStore(storeId: number, staffId: number): Observable<any> {
    return this.http.delete<any>(this.REQUEST_URL + `${storeId}/staffs/${staffId}`);
  }

  update(id: number, body: IStore): Observable<IStore> {
    return this.http.put<IStore>(this.REQUEST_URL + id, body);
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete<any>(this.REQUEST_URL + id);
  }
}

export type ISimpleStaff = {
  id: number;
  name: string;
  email: string;
  isManager?: boolean;
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
