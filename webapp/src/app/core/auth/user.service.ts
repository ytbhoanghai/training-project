import { ICustomerBody } from 'src/app/core/models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../constants/api.constants';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IGrantedPermisson, IUser, IUpdatePass, UserType } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  REQUEST_URL: string = SERVER_URL + '/account/';

  private currentUserSubject: BehaviorSubject<IUser>;
  currentUser$: Observable<IUser>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<IUser>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  fetchUserInfo(): Observable<IUser> {
    return this.http.get<IUser>(this.REQUEST_URL).pipe(
      map((user) => {
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(() => {
        return of(null);
      })
    );
  }

  fetchGrantedPemissions(): Observable<number[]> {
    return this.http.get<number[]>(this.REQUEST_URL + 'permissions');
  }

  createAccount(body: ICustomerBody): Observable<IUser> {
    return this.http.post<IUser>(this.REQUEST_URL.slice(0, -1), body);
  }

  updateAccount(body: IUser): Observable<IUser> {
    return this.http.put<IUser>(this.REQUEST_URL, body);
  }

  updatePassword(body: IUpdatePass): Observable<unknown> {
    return this.http.put<unknown>(this.REQUEST_URL + 'password', body);
  }

  getCurrentUser(): IUser {
    return this.currentUserSubject.value;
  }

  removeCurrentUser(): void {
    return this.currentUserSubject.next(null);
  }

  isLogin(): boolean {
    return this.getCurrentUser() !== null;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.type === UserType[UserType.ADMIN];
  }

  isManager(): boolean {
    const user = this.getCurrentUser();
    return user?.type === UserType[UserType.OTHER] && user.isManager;
  }

  updateCurrentUser(newInfo: IUser): void {
    this.currentUserSubject.next({ ...this.getCurrentUser(), ...newInfo });
  }

  checkPermissionOnResources(): Observable<IGrantedPermisson> {
    const fullPermissions = ['read', 'create', 'update', 'delete'];
    const body: IGrantedPermisson = {
      product: fullPermissions,
      staff: fullPermissions,
      category: fullPermissions,
      role: fullPermissions,
      order: fullPermissions,
    };
    return this.http.post<IGrantedPermisson>(
      this.REQUEST_URL + 'permissions',
      body
    );
  }

  checkAdminPemissonOnResources(): Observable<IGrantedPermisson> {
    const fullPermissions = ['read', 'create', 'update', 'delete'];
    const body: IGrantedPermisson = {
      staff: fullPermissions,
      role: fullPermissions,
      store: fullPermissions,
    };
    return this.http.post<IGrantedPermisson>(
      this.REQUEST_URL + 'permissions',
      body
    );
  }
}
