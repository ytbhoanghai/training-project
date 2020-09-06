import { LoginModalService } from '../service/login-modal.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/auth/user.service';
import { IUser, IGrantedPermisson } from '../core/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  user: IUser = null;
  navbarShown = false;
  grantedPermissions: IGrantedPermisson;

  constructor(
    private userService: UserService,
    private loginModal: LoginModalService
  ) {}

  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.user = user;
    });
    this.checkPermissionOnResources();
  }

  checkPermissionOnResources(): void {
    this.userService.checkAdminPemissonOnResources().subscribe(res => {
      this.grantedPermissions = res;
    })
  }

  canShow(resource: string): boolean {
    if (!this.grantedPermissions) return false;
    return !!this.grantedPermissions[resource]?.includes('read');
  }

  showLoginModal(): void {
    this.loginModal.show();
  }

  toggleSidebar(): void {
    this.navbarShown = !this.navbarShown;
  }
}
