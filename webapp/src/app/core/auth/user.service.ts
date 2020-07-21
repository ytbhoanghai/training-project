import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../constants/api.constants';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject: BehaviorSubject<any>;
  private currentUser$: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  fetchUserInfor(): Observable<any> {
    return this.http.get<any>(SERVER_URL + '/account').pipe(
      map((user) => {
        console.log('user', user);
        this.currentUserSubject.next(user);
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
