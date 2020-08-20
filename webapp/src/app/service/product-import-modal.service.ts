import { IProduct } from 'src/app/manager/product-management/product.service';
import { ProductImportModalComponent } from './../modal/product-import-modal/product-import-modal.component';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductImportModalService {
  modalRef: MDBModalRef;

  private options = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: false,
    ignoreBackdropClick: false,
    class: 'modal-dialog-centered modal-dialog modal-sm',
    containerClass: 'fade bottom',
    animated: true,
    data: {},
  };

  constructor(private modalService: MDBModalService) {}

  show(product: IProduct): void {
    this.options.data = { product };
    this.modalRef = this.modalService.show(ProductImportModalComponent, this.options);
  }

  hide(): void {
    this.modalRef.hide();
  }
}
