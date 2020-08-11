import { NotificationService } from './../layouts/notification/notification.service';
import { IStore } from 'src/app/manager/store-management/store.service';
import { StoreService } from './../manager/store-management/store.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { UserService } from '../core/auth/user.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css'],
})
export class ShoppingComponent implements OnInit, OnDestroy {

  stores: IStore[] = [];
  listener: Subscription;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private notiService: NotificationService
  ) {}

  // If store don't have page then redirect to page 1
  ngOnInit(): void {
    this.listener = this.route.params.subscribe(params => {
      console.log(params)
      if (params.storeId === undefined || !params.storeId) {
        this.fetchStores();
      }
    })
  }

  ngOnDestroy(): void {
    this.listener.unsubscribe();
  }

  // Fetch default store
  fetchStores(): void {
    this.storeService.fetchStores().subscribe((stores) => {
      if (!stores.length) {
        this.notiService.showError('No store has been created!');
        return;
      }

      this.stores = stores;
      this.router.navigate(
        ['/shopping/store', this.stores[0].id, 'category', 'all'],
        { queryParams: { page: 1 } }
      );
    });
  }

  isLogin(): boolean {
    return this.userService.isLogin();
  }
}
