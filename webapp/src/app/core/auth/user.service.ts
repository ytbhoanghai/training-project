import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../constants/api.constants';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export type IUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: string;
  roles: [{ id: string; name: string; createdAt: number }];
  type: string;
  idStore?: number;
  createdAt: number;
  createdBy: number;
  allowDelete: boolean;
  allowUpdate: boolean;
  isManager?: boolean;
};

export enum UserType {
  CUSTOMER,
  ADMIN,
  OTHER,
}

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
      catchError((err) => {
        return of(null);
      })
    );
  }

  fetchGrantedPemissions(): Observable<number[]> {
    return this.http.get<number[]>(this.REQUEST_URL + 'permissions');
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

  updateCurrentUser(newInfo: IUser): void {
    this.currentUserSubject.next({ ...this.getCurrentUser(), ...newInfo });
  }
}

export interface IUpdatePass {
  oldPass: string;
  newPass: string;
}
