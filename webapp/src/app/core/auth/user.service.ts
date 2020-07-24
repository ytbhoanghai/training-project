import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../constants/api.constants';
import { Observable, BehaviorSubject} from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject: BehaviorSubject<any>;
  currentUser$: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  fetchUserInfo(): Observable<any> {
    return this.http.get<any>(SERVER_URL + '/account').pipe(
      map((user) => {
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  removeCurrentUser(): any {
    return this.currentUserSubject.next(null);
  }
}
