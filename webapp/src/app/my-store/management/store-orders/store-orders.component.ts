import { ActivatedRoute } from '@angular/router';
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
  storeId: number;

  constructor(
    private customerService: CustomerService,
    private confirmService: ConfirmModalService,
    private notiService: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.storeId = +params.id;
    })
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.customerService
      .fetchOrdersByStore(this.storeId)
      .subscribe((orders) => {
        this.orders = orders;
      });
  }

  isShipping(order: IOrder): boolean {
    return order.status === 'Shipping';
  }

  markAsShipped(id: number): void {
    this.confirmService.show('Mark as shipped?').onYes(() => {
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
