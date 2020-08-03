import { IStore } from 'src/app/manager/store-management/store.service';
import { StoreService } from './../../manager/store-management/store.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stores: IStore[] = [];

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    // this.fetchStores();
    this.fetchManageableStores();
  }

  fetchStores(): void {
    this.storeService.fetchStores().subscribe(stores => {
      this.stores = stores;
    })
  }

  fetchManageableStores(): void {
    this.storeService.fetchManageableStores().subscribe(stores => {
      this.stores = stores;
    })
  }
}
