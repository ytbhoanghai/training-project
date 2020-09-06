import { LoginModalService } from '../../service/login-modal.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/auth/user.service';
import { IUser } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-admin-info',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
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
