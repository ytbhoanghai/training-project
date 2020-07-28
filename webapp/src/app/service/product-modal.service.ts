import { ProductUpdateComponent } from './../modal/product-update/product-update.component';
import { ProductDetailsComponent } from './../modal/product-details/product-details.component';
import { IProduct } from './../manager/product-management/product.service';
import { MDBModalService, MDBModalRef } from 'ng-uikit-pro-standard';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductModalService {
  private detailsModalRef: MDBModalRef;
  private updateModalRef: MDBModalRef;

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

  constructor(private modalService: MDBModalService) { }

  showDetailsModal(product: IProduct): void {
    this.options.data = { product };
    this.detailsModalRef = this.modalService.show(ProductDetailsComponent, this.options);
  }

  showUpdateModal(product: IProduct): void {
    this.options.data = { product };
    this.updateModalRef = this.modalService.show(ProductUpdateComponent, this.options);
  }

  hideDetailsModal(): void {
    this.detailsModalRef.hide();
  }

  hideUpdateModal(): void {
    this.updateModalRef.hide();
  }
}
