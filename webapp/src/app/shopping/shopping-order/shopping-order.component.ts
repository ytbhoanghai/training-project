import { CustomerService, IOrder } from './../../service/customer.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-order',
  templateUrl: './shopping-order.component.html',
  styleUrls: ['./shopping-order.component.css']
})
export class ShoppingOrderComponent implements OnInit {
  orders: IOrder[] = [];
  isHidden = false;


  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.customerService.fetchOrders().subscribe(orders => {
      this.orders = orders;
    })
  }

  getId(transactionId: string): string {
    return transactionId.split("_")[1];
  }

  isShipping(status: string): boolean {
    return status === 'Shipping';
  }

  toggleHidden(): void {
    this.isHidden = !this.isHidden;
  }

}
