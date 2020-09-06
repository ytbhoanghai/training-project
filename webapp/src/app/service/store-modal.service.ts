import { StoreUpdateModalComponent } from './../modal/store-update-modal/store-update-modal.component';
import { StoreDetailsModalComponent } from './../modal/store-details-modal/store-details-modal.component';
import { Injectable } from '@angular/core';
import { MDBModalService, MDBModalRef } from 'ng-uikit-pro-standard';
import { IStore } from 'src/app/core/models';

@Injectable({
  providedIn: 'root',
})
export class StoreModalService {
  storeDetailsModalRef: MDBModalRef;
  storeUpdateModalRef: MDBModalRef;

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

  showDetailsModal(store: IStore): void {
    this.options.data = { store };
    this.storeDetailsModalRef = this.modalService.show(StoreDetailsModalComponent, this.options);
  }

  showUpdateModal(store: IStore): void {
    this.options.data = { store };
    this.storeUpdateModalRef = this.modalService.show(StoreUpdateModalComponent, this.options);
  }

  hideDetailsModal(): void {
    this.storeDetailsModalRef.hide();
  }

  hideUpdateModal(): void {
    this.storeUpdateModalRef.hide();
  }
}
