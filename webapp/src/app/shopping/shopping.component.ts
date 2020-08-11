import { IStore } from 'src/app/manager/store-management/store.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/auth/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css'],
})
export class ShoppingComponent implements OnInit {
  stores: IStore[] = [];
  listener: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  isLogin(): boolean {
    return this.userService.isLogin();
  }
}
