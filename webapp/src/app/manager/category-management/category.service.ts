import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_URL } from './../../core/constants/api.constants';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  addedSubject = new Subject<ICategory>();
  addedObservable$ = this.addedSubject.asObservable();

  updateSubject = new Subject();
  updateObservable$ = this.updateSubject.asObservable();

  private REQUEST_URL = SERVER_URL + '/categories/';

  constructor(private http: HttpClient) { }

  fetchCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.REQUEST_URL.slice(0, -1));
  }

  fetchCategoryById(id: number): Observable<ICategory> {
    return this.http.get<ICategory>(this.REQUEST_URL + id);
  }

  save(body: ICategoryBody): Observable<ICategory> {
    return this.http.post<ICategory>(this.REQUEST_URL, body);
  }

  update(id: number, body: ICategoryBody): Observable<ICategory> {
    return this.http.put<ICategory>(this.REQUEST_URL + id, body);
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete<any>(SERVER_URL + `/manager/categories/${id}`);
  }
}

export interface ICategory {
  id: number;
  name: string;
  description?: string;
  storeId?: number;
  createdAt: number;
  isActive?: boolean;
}

export interface ICategoryBody {
  name: string
}
