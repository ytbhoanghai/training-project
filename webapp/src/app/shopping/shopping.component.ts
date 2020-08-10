import { NotificationService } from './../layouts/notification/notification.service';
import { IStore } from 'src/app/manager/store-management/store.service';
import { StoreService } from './../manager/store-management/store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/auth/user.service';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css'],
})
export class ShoppingComponent implements OnInit {
  stores: IStore[] = [];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private notiService: NotificationService
  ) {}

  // If store don't have page then redirect to page 1
  ngOnInit(): void {
    if (this.route.snapshot.params.storeId === undefined) {
      this.fetchStores();
    }
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
