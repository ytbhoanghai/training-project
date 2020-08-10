import { Component, OnInit, Output, EventEmitter } from '@angular/core';

declare let Stripe;
@Component({
  selector: 'app-stripe-form',
  templateUrl: './stripe-form.component.html',
  styleUrls: ['./stripe-form.component.css'],
})
export class StripeFormComponent implements OnInit {
  @Output() onToken = new EventEmitter();

  isCardValid = false;
  card;
  stripe;

  constructor() {}

  ngOnInit(): void {
    this.stripe = new Stripe('pk_test_QOOyeVrCYofsYsT36rGSO9Ij00IaJ3SQYt');

    const elements = this.stripe.elements();
    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };
    this.card = elements.create('card', { style: style });
    this.card.mount('#card-element');
    this.card.addEventListener('change', (event) => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }

  handleCardSubmit(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.stripe.createToken(this.card).then((result) => {
        if (result.error) {
          console.log('Error creating payment method.');
          const errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
          this.isCardValid = false;
          return reject(result.error);
        } else {
          // At this point, you should send the token ID
          // to your server so it can attach
          // the payment source to a customer
          this.isCardValid = true;
          console.log('Token acquired!');
          console.log(result.token);
          console.log(result.token.id);
          this.onToken.emit(result.token);
          return resolve(result.token);
        }
      });
    });
  }

}
