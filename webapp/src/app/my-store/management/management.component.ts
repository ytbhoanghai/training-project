import { ActivatedRoute } from '@angular/router';
import {
  StoreService,
  StatusType,
} from './../../manager/store-management/store.service';
import { IStore } from 'src/app/manager/store-management/store.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css'],
})
export class ManagementComponent implements OnInit {
  store: IStore;
  storeId: number;

  constructor(
    private storeService: StoreService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchCurrentStore();
  }

  fetchCurrentStore(): void {
    this.route.params.subscribe((params) => {
      this.storeId = params.id;
      this.storeService.fetchById(this.storeId).subscribe((store) => {
        this.store = store;
      });
    });
  }

  isClosed(): boolean {
    return this.store?.status.toString() == StatusType[StatusType.Closed];
  }
}
