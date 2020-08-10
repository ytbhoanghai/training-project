import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_URL } from '../constants/api.constants';
import { UserService } from './user.service';

type JwtToken = {
  id_token: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private jwtLocalStorageName = 'authenticationToken';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {}

  loginUser(username: string, password: string): Observable<any> {
    return this.http
      .post<JwtToken>(`${SERVER_URL}/authenticate`, {
        username,
        password,
      })
      .pipe(map((jwt) => this.authenticateSuccess(jwt)));
  }

  // Convert logout to Observable
  logoutUser(): Observable<any> {
    return new Observable((observer) => {
      localStorage.removeItem(this.jwtLocalStorageName);
      this.router.navigate(['']);
      this.userService.removeCurrentUser();
      observer.next();
    });
  }

  // Store jwt into local storage after authenticate success
  private authenticateSuccess(jwt: JwtToken) {
    localStorage.setItem(this.jwtLocalStorageName, jwt.id_token);
    this.router.navigateByUrl(location.pathname, {skipLocationChange: true});
    this.userService.fetchUserInfo().subscribe(null);
  }

  getAuthToken(): string {
    return localStorage.getItem(this.jwtLocalStorageName) || '';
  }
}
