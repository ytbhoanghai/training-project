import { Component, OnInit } from '@angular/core';
import { MDBModalService } from 'ng-uikit-pro-standard';
import { UserService } from '../core/auth/user.service';
import { LoginModalComponent } from '../modal/login-modal/login-modal.component';
import { IUser } from '../core/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: IUser = null;

  constructor(
    private userService: UserService,
    private modalService: MDBModalService
  ) {}

  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  showLoginModal(): void {
    this.modalService.show(LoginModalComponent, {
      containerClass: 'fade left',
    });
  }
}
