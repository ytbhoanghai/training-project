import { CartService } from './../../service/cart.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_URL } from '../constants/api.constants';
import { UserService, UserType } from './user.service';

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
    private router: Router,
    private userService: UserService,
    private cartService: CartService
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
      this.cartService.clearLocalCart();
      observer.next();
    });
  }

  // Store jwt into local storage after authenticate success
  private authenticateSuccess(jwt: JwtToken) {
    localStorage.setItem(this.jwtLocalStorageName, jwt.id_token);
    this.router.navigateByUrl(location.pathname, { skipLocationChange: true });
    this.userService.fetchUserInfo().subscribe((user) => {
      // Do after fetched info
      console.log(user.type === UserType[UserType.ADMIN]);
      this.cartService.fetchCart();
    });
  }

  navigateUserByType(type: string): void {
    switch (type) {
      case UserType[UserType.ADMIN]:
        this.router.navigate(['/admin']);
        return;
      case UserType[UserType.OTHER]:
        this.router.navigate(['/my-store']);
        return;
    }
  }

  getAuthToken(): string {
    return localStorage.getItem(this.jwtLocalStorageName) || '';
  }
}
