import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/core/auth/user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CheckAuthoritiesGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      return true;
    }
    // this.router.navigate(['/accessdenied']);
    return false;
  }
  
}
