import { LoginModalService } from './../../service/login-modal.service';
import { NotificationService } from './../../layouts/notification/notification.service';
import { UserService } from './../../core/auth/user.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckLoginGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private notiService: NotificationService,
    private loginModalService: LoginModalService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      return true;
    }
    this.loginModalService.show();
    this.notiService.showWaring('Please login to continue!');
    return false;
  }
}
