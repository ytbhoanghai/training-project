import { UserService } from './../../../core/auth/user.service';
import { NotificationService } from 'src/app/layouts/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomerService } from './../../../service/customer.service';
import { LocalCartService } from './../../../service/local-cart.service';
import { IProduct } from './../../../manager/product-management/product.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  @Input() product: IProduct;
  isOutOfStock: boolean = false;

  constructor(
    private localCartService: LocalCartService,
    private customerService: CustomerService,
    private notiService: NotificationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  addToCart(): void {
    if (!this.userService.isLogin()) {
      this.localCartService.addItem(this.product);
      return;
    }

    // Default quantity at 1
    this.customerService.addItemToCart(this.product.id, 1).subscribe(
      (item) => {
        this.localCartService.events.add.next(item);
        this.notiService.showSuccess();
      },
      (err: HttpErrorResponse) => {
        if (err.status === 406) {
          this.isOutOfStock = true;
          this.notiService.showWaring(
            `Reach maximum ${this.product.quantity} items. This product is out of stock`
          );
        }
      }
    );
  }
}
