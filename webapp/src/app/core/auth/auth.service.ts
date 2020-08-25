import { NotificationService } from 'src/app/layouts/notification/notification.service';
import { CartService } from './../../service/cart.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_URL } from '../constants/api.constants';
import { UserService, UserType, IUser } from './user.service';

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
    private cartService: CartService,
    private notiService: NotificationService
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
      this.router.navigate(['/account/login']);
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
      this.navigateUser(user);
      this.cartService.fetchCart();
    });
  }

  navigateUser(user: IUser): void {
    switch (user.type) {
      case UserType[UserType.ADMIN]:
        this.router.navigate(['/admin']);
        this.notiService.showSuccess('Logged in as Admin!');
        return;
      case UserType[UserType.OTHER]:
        if (user.isManager) {
          this.router.navigate(['/my-store']);
          this.notiService.showSuccess('Logged in as Store Manager!');
        }
        return;
    }
  }

  getAuthToken(): string {
    return localStorage.getItem(this.jwtLocalStorageName) || '';
  }
}
