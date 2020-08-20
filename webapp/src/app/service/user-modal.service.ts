import { UserAddModalComponent } from './../modal/user-add-modal/user-add-modal.component';
import { Injectable } from '@angular/core';
import { UserDetailsModalComponent } from '../modal/user-details-modal/user-details-modal.component';
import { UserUpdateModalComponent } from '../modal/user-update-modal/user-update-modal.component';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { IUser } from '../core/auth/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserModalService {
  public userDetailsModalRef: MDBModalRef;
  public userUpdateModalRef: MDBModalRef;
  public userAddModalRef: MDBModalRef;

  private options = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: false,
    ignoreBackdropClick: false,
    class: '',
    containerClass: '',
    animated: true,
    data: {},
  };

  constructor(private modalService: MDBModalService) {}

  showDetailModel(user?: IUser): void {
    this.options.data = { user };
    this.userDetailsModalRef = this.modalService.show(
      UserDetailsModalComponent,
      this.options
    );
  }

  showUpdateModal(user?: IUser): void {
    this.options.data = { user };
    this.userUpdateModalRef = this.modalService.show(
      UserUpdateModalComponent,
      this.options
    );
  }

  showAddModal(data: { storeId: number }): void {
    this.options.data = { storeId: data.storeId };
    this.userAddModalRef = this.modalService.show(
      UserAddModalComponent,
      this.options
    );
  }

  hideAddModal(): void {
    this.userAddModalRef.hide();
  }
}
