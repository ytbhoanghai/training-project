import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../constants/api.constants';
import { Observable, of, BehaviorSubject} from 'rxjs';
import {catchError, map} from "rxjs/operators";

export type IUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: string;
  roles: [
    { id: string, name: string, createdAt: number}
  ];
  idStore?: number;
  createdAt: number;
  createdBy: number
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject: BehaviorSubject<IUser>;
  currentUser$: Observable<IUser>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<IUser>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  fetchUserInfo(): Observable<IUser> {
    return this.http.get<IUser>(SERVER_URL + '/account').pipe(
      map((user) => {
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(err => {
        console.log("IN user service")
        return of(null)
      } )
    );
  }

  getCurrentUser(): IUser {
    return this.currentUserSubject.value;
  }

  removeCurrentUser(): void {
    return this.currentUserSubject.next(null);
  }
}
