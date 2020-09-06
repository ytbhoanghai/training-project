import { ProductAddModalComponent } from './../modal/product-add-modal/product-add-modal.component';
import { ProductUpdateComponent } from './../modal/product-update/product-update.component';
import { ProductDetailsComponent } from './../modal/product-details/product-details.component';
import { IProduct } from 'src/app/core/models';
import { MDBModalService, MDBModalRef } from 'ng-uikit-pro-standard';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductModalService {
  private modalDetailsRef: MDBModalRef;
  private modalUpdateRef: MDBModalRef;
  private modalAddRef: MDBModalRef;

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

  showAddModal(storeId: number): void {
    this.options.data = { storeId };
    this.modalAddRef = this.modalService.show(
      ProductAddModalComponent,
      this.options
    );
  }

  hideAddModal(): void {
    this.modalAddRef.hide();
  }

  showDetailsModal(product: IProduct): void {
    this.options.data = { product };
    this.modalDetailsRef = this.modalService.show(
      ProductDetailsComponent,
      this.options
    );
  }

  showUpdateModal(product: IProduct): void {
    this.options.data = { product };
    this.modalUpdateRef = this.modalService.show(
      ProductUpdateComponent,
      this.options
    );
  }

  hideDetailsModal(): void {
    this.modalDetailsRef.hide();
  }

  hideUpdateModal(): void {
    this.modalUpdateRef.hide();
  }
}
