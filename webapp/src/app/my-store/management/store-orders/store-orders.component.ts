import { Component, OnInit } from '@angular/core';
import {CustomerService, IOrder} from "../../../service/customer.service";

@Component({
  selector: 'app-store-orders',
  templateUrl: './store-orders.component.html',
  styleUrls: ['./store-orders.component.css']
})
export class StoreOrdersComponent implements OnInit {
  orders: IOrder[] = [];

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.customerService.fetchOrders().subscribe(orders => {
      this.orders = orders;
    })

  }

  isShipping(order: IOrder): boolean {
    return order.status === 'Shipping';
  }

}
