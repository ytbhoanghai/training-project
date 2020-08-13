import { ShoppingDetailsComponent } from './../modal/shopping-details/shopping-details.component';
import { IProduct } from './../manager/product-management/product.service';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingModalService {
  private modalRef: MDBModalRef;

  private options = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: false,
    ignoreBackdropClick: false,
    class: 'modal-dialog modal-dialog-centered modal-lg',
    containerClass: 'fade bottom',
    animated: true,
    data: {},
  };

  constructor(private modalService: MDBModalService) { }

  show(product: IProduct): void {
    this.options.data = { product };
    this.modalRef = this.modalService.show(ShoppingDetailsComponent, this.options);
  }

  hide(): void {
    this.modalRef.hide();
  }
}
