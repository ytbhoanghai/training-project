import {Injectable} from '@angular/core';
import {UserDetailsModalComponent} from "../modal/user-details-modal/user-details-modal.component";
import {UserUpdateModalComponent} from "../modal/user-update-modal/user-update-modal.component";
import {MDBModalRef, MDBModalService} from "ng-uikit-pro-standard";
import {IUser} from "../core/auth/user.service";

@Injectable({
  providedIn: 'root'
})
export class UserModalService {
  public userDetailsModalRef: MDBModalRef;
  public userUpdateModalRef: MDBModalRef;

  private options = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: false,
    ignoreBackdropClick: false,
    class: '',
    containerClass: '',
    animated: true,
    data: {}
  }

  constructor(private modalService: MDBModalService) {
  }

  showDetailModel(user?: IUser): void {
    this.options.data = { user };
    this.userDetailsModalRef = this.modalService.show(UserDetailsModalComponent, this.options);
  }

  showUpdateModal(user?: IUser): void {
    this.options.data = { user };
    this.userUpdateModalRef = this.modalService.show(UserUpdateModalComponent, this.options);
  }
}
