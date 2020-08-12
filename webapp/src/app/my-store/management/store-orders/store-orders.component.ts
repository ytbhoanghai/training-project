import { NotificationService } from 'src/app/layouts/notification/notification.service';
import { ConfirmModalService } from './../../../service/confirm-modal.service';
import { Component, OnInit } from '@angular/core';
import { CustomerService, IOrder } from '../../../service/customer.service';

@Component({
  selector: 'app-store-orders',
  templateUrl: './store-orders.component.html',
  styleUrls: ['./store-orders.component.css'],
})
export class StoreOrdersComponent implements OnInit {
  orders: IOrder[] = [];

  constructor(
    private customerService: CustomerService,
    private confirmService: ConfirmModalService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.customerService.fetchOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }

  isShipping(order: IOrder): boolean {
    return order.status === 'Shipping';
  }

  markAsShipped(id: number): void {
    this.confirmService.show().onYes(() => {
      this.customerService
        .updateOrderStatus(id, { status: 'Shipped' })
        .subscribe((order) => {
          const index = this.orders.findIndex((order) => order.id === id);
          this.orders[index] = order;
          this.notiService.showSuccess('Update order successfully!');
        });
    });
  }
}
