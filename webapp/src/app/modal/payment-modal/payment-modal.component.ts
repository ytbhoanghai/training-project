import { PaymentModalService, IPaymentInfo } from './../../service/payment-modal.service';
import { Component, OnInit } from '@angular/core';
import {ClassGetter} from "@angular/compiler/src/output/output_ast";

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css'],
})
export class PaymentModalComponent implements OnInit {
  paymentInfo: IPaymentInfo;

  constructor(private paymentModal: PaymentModalService) {}

  ngOnInit(): void {}

  hideModal(): void {
    this.paymentModal.hide();
  }

  handleToken(token: { id: string }): void {
    this.paymentInfo.stripeToken = token.id;
  }

  handlePayment(): void {
    console.log(this.paymentInfo)
  }
}
