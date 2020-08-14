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
    this.fetchManageableStores();
  }

  fetchManageableStores(): void {
    this.storeService.fetchManageableStores().subscribe(stores => {
      // Prevent null when user is unauthorized to read store
      this.stores = stores || [];
    })
  }
}
