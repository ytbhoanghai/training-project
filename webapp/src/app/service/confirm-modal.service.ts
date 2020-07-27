import { MDBModalRef } from 'ng-uikit-pro-standard';
import { ConfirmModalComponent } from './../modal/confirm-modal/confirm-modal.component';
import { MDBModalService } from 'ng-uikit-pro-standard';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfirmModalService {
  constructor(private modalService: MDBModalService) {}

  show(key: string): MDBModalRef {
    return this.modalService.show(ConfirmModalComponent, {
      containerClass: 'modal fade top',
      class: 'modal-dialog modal-frame modal-top',
      data: { key },
    });
  }
}
