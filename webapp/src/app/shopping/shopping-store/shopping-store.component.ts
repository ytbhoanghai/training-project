import { IStore } from 'src/app/manager/store-management/store.service';
import { StoreService } from './../../manager/store-management/store.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-store',
  templateUrl: './shopping-store.component.html',
  styleUrls: ['./shopping-store.component.css']
})
export class ShoppingStoreComponent implements OnInit {
  stores: IStore[] = [];

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    this.fetchStores();
  }

  fetchStores(): void {
    this.storeService.fetchStores().subscribe(stores => {
      this.stores = stores;
    })
  }
}
