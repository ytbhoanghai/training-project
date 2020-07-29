import { MDBModalRef } from 'ng-uikit-pro-standard';
import { ConfirmModalComponent } from './../modal/confirm-modal/confirm-modal.component';
import { MDBModalService } from 'ng-uikit-pro-standard';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfirmModalService {
  modalRef: MDBModalRef;

  constructor(private modalService: MDBModalService) {}

  show(key?: string): ConfirmModalService {
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      containerClass: 'modal fade top',
      class: 'modal-dialog modal-frame modal-top',
      data: { key },
    });
    return this;
  }

  onYes(fn: Function): any {
    this.modalRef.content.action.subscribe(({value, key}) => {
      if (value === ConfirmModalComponent.YES) {
        fn();
        this.modalRef.hide();
        this.modalRef.content.action.unsubscribe();
      }
    })
  }
}
