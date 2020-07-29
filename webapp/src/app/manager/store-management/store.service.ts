import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../../core/constants/api.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private REQUEST_URL: string = SERVER_URL + '/stores/';

  public updateSubject = new Subject();
  public updateObservable$ = this.updateSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchStores(): Observable<IStore[]> {
    return this.http.get<IStore[]>(this.REQUEST_URL);
  }

  fetchById(id: number): Observable<IStore> {
    return this.http.get<IStore>(this.REQUEST_URL + id);
  }

  save(body: IStore): Observable<IStore> {
    return this.http.post<IStore>(this.REQUEST_URL, body);
  }

  update(id: number, body: IStore): Observable<IStore> {
    return this.http.put<IStore>(this.REQUEST_URL + id, body);
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete<any>(this.REQUEST_URL + id);
  }
}

export type IStore = {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  status: StatusType;
  createdAt: number;
};

enum StatusType {
  Closed,
  Open,
}
