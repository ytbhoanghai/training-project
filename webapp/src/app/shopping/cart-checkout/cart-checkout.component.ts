import { PaymentModalService } from './../../service/payment-modal.service';
import { NotificationService } from 'src/app/layouts/notification/notification.service';
import { Subscription } from 'rxjs';
import { UserCheckoutFormComponent } from './user-checkout-form/user-checkout-form.component';
import { ICart } from 'src/app/core/models';
import { CartService } from './../../service/cart.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-cart-checkout',
  templateUrl: './cart-checkout.component.html',
  styleUrls: ['./cart-checkout.component.css'],
})
export class CartCheckoutComponent implements OnInit, OnDestroy {
  @ViewChild(UserCheckoutFormComponent)
  checkoutComponent: UserCheckoutFormComponent;
  cart: ICart = { totalPrice: 0, items: [] };
  listener: Subscription;

  constructor(
    private cartService: CartService,
    private notiService: NotificationService,
    private paymentModal: PaymentModalService
  ) {}

  ngOnInit(): void {
    this.cartService.fetchCart();
    this.listener = this.cartService.changeListener$.subscribe((cart) => {
      this.cart = this.cartService.getCart();
    });
  }

  ngOnDestroy(): void {
    this.listener.unsubscribe();
  }

  handleCheckout(): void {
    const curentCart = this.cartService.getCart();
    if (!curentCart.items.length) {
      this.notiService.showQuickWarning('Empty cart');
      return;
    }

    if (!this.isValidForm()) {
      this.notiService.showQuickWarning('Please fill in your information');
      return;
    }

    const body = this.checkoutComponent.userForm;
    body.totalPrice = this.cartService.getCart().totalPrice;
    this.paymentModal.show(body);
  }

  isValidForm(): boolean {
    const body = this.checkoutComponent.userForm;
    return body.shipAddress !== '' && body.phone !== '';
  }
}
