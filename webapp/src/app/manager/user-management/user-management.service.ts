import { Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '../../core/auth/user.service';
import { SERVER_URL } from '../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  public updateSubject = new Subject();
  public updateObservable$ = this.updateSubject.asObservable();

  userAddSubject = new BehaviorSubject<IUser>(null);
  userAddObservable$ = this.userAddSubject.asObservable();

  private REQUEST_URL = `${SERVER_URL}/staffs/`;

  constructor(private http: HttpClient) {}

  fetchAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.REQUEST_URL);
  }

  fetchById(id: number): Observable<IUser> {
    return this.http.get<IUser>(this.REQUEST_URL + id).pipe(
      map((user) => {
        return user;
      })
    );
  }

  fetchAssignableStaffs(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.REQUEST_URL, {
      params: new HttpParams().set('option', 'NotInStore')
    });
  }

  save(body: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.REQUEST_URL, body);
  }

  update(id: number, body: IUser): Observable<IUser> {
    return this.http.put<IUser>(this.REQUEST_URL + id, body);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.REQUEST_URL + id);
  }
}
