import { LoginModalService } from '../service/login-modal.service';
import { Component, OnInit } from '@angular/core';
import { IUser, UserService } from '../core/auth/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  user: IUser = null;

  constructor(
    private userService: UserService,
    private loginModal: LoginModalService
  ) {}

  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  showLoginModal(): void {
    this.loginModal.show();
  }
}
