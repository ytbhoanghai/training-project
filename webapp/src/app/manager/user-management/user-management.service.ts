import { Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_URL } from '../../core/constants/api.constants';
import { IUser } from 'src/app/core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  public updateSubject = new Subject();
  public updateObservable$ = this.updateSubject.asObservable();

  userAddSubject = new BehaviorSubject<IUser>(null);
  userAddObservable$ = this.userAddSubject.asObservable();

  private REQUEST_URL = `${SERVER_URL}/staffs/`;
  private ADMIN_URL = `${SERVER_URL}/admin/staffs/`;
  private MANAGER_URL = `${SERVER_URL}/manager/staffs/`;

  constructor(private http: HttpClient) {}

  fetchAllFromAdmin(): Observable<IUser[]> {
    return this.http.get<IUser[]>(SERVER_URL + '/admin/staffs');
  }

  fetchAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.MANAGER_URL);
  }

  fetchById(id: number): Observable<IUser> {
    return this.http.get<IUser>(this.REQUEST_URL + id).pipe(
      map((user) => {
        return user;
      })
    );
  }

  fetchAssignableStaffs(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.MANAGER_URL, {
      params: new HttpParams().set('option', 'NotInStore')
    });
  }

  save(body: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.REQUEST_URL, body);
  }

  saveFromAdmin(body: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.ADMIN_URL, body);
  }

  update(id: number, body: IUser): Observable<IUser> {
    if (location.pathname.startsWith('/my-store'))
      return this.http.put<IUser>(this.MANAGER_URL + id, body);
    else if (location.pathname.startsWith('/admin'))
      return this.http.put<IUser>(this.ADMIN_URL + id, body);
    else
      return this.http.put<IUser>(this.REQUEST_URL + id, body);
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete<unknown>(this.REQUEST_URL + id);
  }

  checkPermissionOnResources(body: Record<string, string[]>): Observable<unknown> {
    console.log(body);
    return null;
  }
}
