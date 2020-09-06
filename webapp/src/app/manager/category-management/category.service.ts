import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_URL } from './../../core/constants/api.constants';
import { Injectable } from '@angular/core';
import { ICategory, ICategoryBody } from 'src/app/core/models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  addedSubject = new Subject<ICategory>();
  addedObservable$ = this.addedSubject.asObservable();

  updateSubject = new Subject();
  updateObservable$ = this.updateSubject.asObservable();

  private REQUEST_URL = SERVER_URL + '/categories/';
  private MANAGER_URL = SERVER_URL + '/manager/categories/';

  constructor(private http: HttpClient) { }

  fetchCategories(): Observable<ICategory[]> {
    if (location.pathname.startsWith('/my-store'))
      return this.http.get<ICategory[]>(this.MANAGER_URL.slice(0, -1));
    else
      return this.http.get<ICategory[]>(this.REQUEST_URL.slice(0, -1));
  }

  fetchCategoriesFromManager(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.MANAGER_URL.slice(0, -1));
  }

  fetchCategoryById(id: number): Observable<ICategory> {
    return this.http.get<ICategory>(this.MANAGER_URL + id);
  }

  save(body: ICategoryBody): Observable<ICategory> {
    return this.http.post<ICategory>(this.MANAGER_URL, body);
  }

  update(id: number, body: ICategoryBody): Observable<ICategory> {
    return this.http.put<ICategory>(this.MANAGER_URL + id, body);
  }

  deleteById(id: number): Observable<unknown> {
    return this.http.delete<unknown>(this.MANAGER_URL + id);
  }
}
