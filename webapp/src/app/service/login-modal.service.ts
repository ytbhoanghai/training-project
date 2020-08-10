import { LoginModalComponent } from './../modal/login-modal/login-modal.component';
import { MDBModalService, MDBModalRef } from 'ng-uikit-pro-standard';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginModalService {
  modalLoginRef: MDBModalRef;

  constructor(private modalService: MDBModalService) { }

  show(): void {
    this.modalLoginRef = this.modalService.show(LoginModalComponent, {
      containerClass: 'fade left',
    });
  }

  hide(): void {
    this.modalLoginRef.hide();
  }
}
