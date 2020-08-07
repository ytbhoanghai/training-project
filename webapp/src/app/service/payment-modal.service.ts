import { PaymentModalComponent } from './../modal/payment-modal/payment-modal.component';
import { MDBModalService, MDBModalRef } from 'ng-uikit-pro-standard';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaymentModalService {
  modalRef: MDBModalRef;

  private options = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: false,
    ignoreBackdropClick: false,
    class: 'modal-dialog-centered modal-dialog',
    containerClass: '',
    animated: true,
    data: {},
  };

  constructor(private modalService: MDBModalService) {}

  show(data: IPaymentInfo): void {
    this.options.data = { paymentInfo: data };
    this.modalRef = this.modalService.show(PaymentModalComponent, this.options);
  }

  hide(): void {
    this.modalRef.hide();
  }
}

export interface IPaymentInfo {
  name: string;
  address?: string;
  shipAddress: string;
  email: string;
  stripeToken?: string;
  phone: string;
  totalPrice: number;
}
