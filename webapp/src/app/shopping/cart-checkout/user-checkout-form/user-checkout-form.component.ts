import { UserService, IUser } from './../../../core/auth/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-checkout-form',
  templateUrl: './user-checkout-form.component.html',
  styleUrls: ['./user-checkout-form.component.css'],
})
export class UserCheckoutFormComponent implements OnInit {
  user: IUser;

  userForm = {
    name: '',
    address: '',
    shipAddress: 'Ward 2, Tan Binh District, HCMC',
    email: '',
    phone: '0123321123',
    stripeToken: '',
    totalPrice: 0
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUserInfo();
  }

  fetchUserInfo(): void {
    this.user = this.userService.getCurrentUser();

    this.userForm.name = this.user?.name;
    this.userForm.address = this.user?.address;
    this.userForm.email = this.user?.email;
  }

  handleToken(token: { id: string }): void {
    this.userForm.stripeToken = token.id;
  }

}
