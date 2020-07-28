import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from 'src/app/core/auth/user.service';
import {MDBModalRef, MDBModalService} from "ng-uikit-pro-standard";
import {LoginModalComponent} from "../../modal/login-modal/login-modal.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  modalLoginRef: MDBModalRef;
  name: string;

  constructor(
    private modalService: MDBModalService,
    private authService: AuthService,
    private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.fetchUserInfo().subscribe(value => this.name = value?.name, err => console.log(err));
    this.userService.currentUser$.subscribe(value => this.name = value?.name);
  }

  logout(): void {
    this.authService.logoutUser().subscribe(_ => this.name = null);
  }

  openModalLogin(): void {
    this.modalLoginRef = this.modalService.show(LoginModalComponent, {
      containerClass: 'fade left'
    });
  }
}
