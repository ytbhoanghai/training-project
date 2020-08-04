import { UserService } from './../../core/auth/user.service';
import { CustomerService, ICartItem } from './../../service/customer.service';
import { NotificationService } from './../../layouts/notification/notification.service';
import { LocalCartService } from './../../service/local-cart.service';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  items: ICartItem[] = [];
  totalPrice: number;

  @Output() onDelete = new EventEmitter();
  listener: Subscription;

  constructor(
    private localCartService: LocalCartService,
    private notiService: NotificationService,
    private customerService: CustomerService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchLocalCart();
    this.checkCartStatus();

    this.listener = this.localCartService.listeners.onChange.subscribe(
      (item) => {
        this.fetchLocalCart();
        this.notiService.showQuickSuccess('Cart updated!');
      }
    );

    this.localCartService.listeners.onDelete.subscribe(id => {
      this.items = this.items.filter(item => item.id !== id);
    });

    this.localCartService.listeners.onAdd.subscribe((item: ICartItem) => {
      this.items.push(item);
    })
  }

  ngOnDestroy(): void {
    this.listener.unsubscribe();
  }

  fetchLocalCart(): void {
    this.items = this.localCartService.getItems();
    this.totalPrice = this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  checkCartStatus(): void {
    if (!this.userService.isLogin()) return;

    if (this.localCartService.isEmpty()) {
      this.fetchRemoteCart();
    } else {
      this.mergeCart();
    }
  }

  fetchRemoteCart(): void {
    console.log('FETCHING CART');
    this.customerService.getMyCart().subscribe((cart) => {
      this.items = cart.items;
    });
  }

  mergeCart(): void {
    console.log('START MERGING CART');
    this.localCartService.getItems().map((item) => {
      this.customerService
        .addItemToCart(item.id, item.quantity)
        .subscribe(null, (err) => console.log('Error on merge'));
    });
    this.localCartService.clear();
  }

  deleteItem(id: number): void {
    if (!this.userService.isLogin()) {
      this.localCartService.deleteItemById(id);
      return;
    }

    this.customerService.removeCartItem(id).subscribe(
      () => {
        this.localCartService.events.delete.next(id);
        this.notiService.showSuccess();
      },
      (err) => console.log(err)
    );
  }
}
