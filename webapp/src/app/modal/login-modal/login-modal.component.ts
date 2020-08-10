import { Component, OnInit, ViewChild } from '@angular/core';
import {AuthService} from "../../core/auth/auth.service";
import {MDBModalRef, SBItemComponent} from "ng-uikit-pro-standard";

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  username: string;
  password: string;
  messageError: string;

  isHidden = false;
  @ViewChild('regItem') regItem: SBItemComponent;

  constructor(
    private modalRef: MDBModalRef,
    private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  authenticate(): void {
    this.authService.loginUser(this.username, this.password).subscribe(_ => this.modalRef.hide(), error => {
      this.messageError = error.error.message;
    });
  }

  closeModal(): void {
    this.modalRef.hide();
  }

  toggle(): void {
    this.isHidden = !this.isHidden;
    this.regItem.toggle(true);
  }

}
