import { IRole } from './../manager/role-management/role-management.component';
import { RoleUpdateModalComponent } from './../modal/role-update-modal/role-update-modal.component';
import { RoleAddModalComponent } from './../modal/role-add-modal/role-add-modal.component';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoleModalService {
  modalAddRef: MDBModalRef;
  modalUpdateRef: MDBModalRef;

  private options = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: false,
    ignoreBackdropClick: false,
    class: 'modal-dialog-centered modal-xl',
    containerClass: 'fade bottom',
    animated: true,
    data: {},
  };

  constructor(private modalService: MDBModalService) {}

  showAddModal(): void {
    this.modalAddRef = this.modalService.show(RoleAddModalComponent, this.options);
  }

  hideAddModal(): void {
    this.modalAddRef.hide();
  }

  showUpdateModal(role: IRole): void {
    this.options.data = { role };
    this.modalUpdateRef = this.modalService.show(RoleUpdateModalComponent, this.options);
  }

  hideUpdateModal(): void {
    this.modalUpdateRef.hide();
  }
}
