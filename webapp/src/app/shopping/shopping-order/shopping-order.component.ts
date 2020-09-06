import { CustomerService } from './../../service/customer.service';
import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { IOrder } from 'src/app/core/models';

@Component({
  selector: 'app-shopping-order',
  templateUrl: './shopping-order.component.html',
  styleUrls: ['./shopping-order.component.css'],
})
export class ShoppingOrderComponent implements OnInit {
  orders: IOrder[] = [];
  isShown = false;

  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isShown = false;
    }
  }

  constructor(
    private customerService: CustomerService,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.customerService.fetchOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }

  getId(transactionId: string): string {
    return transactionId.split('_')[1];
  }

  isShipping(status: string): boolean {
    return status === 'Shipping';
  }

  toggleHidden(): void {
    this.isShown = !this.isShown;
  }
}
