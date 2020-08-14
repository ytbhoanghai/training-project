import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { MDBModalRef } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css'],
})
export class LoginModalComponent implements OnInit {
  username: string;
  password: string;
  messageError: string;

  isRegHidden = true;
  @ViewChild('loginBtn') loginBtn: ElementRef;
  @ViewChild('regBtn') regBtn: ElementRef;

  constructor(
    private modalRef: MDBModalRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  authenticate(): void {
    this.authService.loginUser(this.username, this.password).subscribe(
      () => {
        this.modalRef.hide();
      },
      (error) => {
        this.messageError = error.error.message;
      }
    );
  }

  closeModal(): void {
    this.modalRef.hide();
  }

  registerClick(): void {
    this.isRegHidden = !this.isRegHidden;
    if (this.isRegHidden) {
      this.loginBtn.nativeElement.click();
    }
  }
}
