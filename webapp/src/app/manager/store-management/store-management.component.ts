import { NotificationService } from './../../layouts/notification/notification.service';
import { MDBModalRef } from 'ng-uikit-pro-standard';
import { ConfirmModalService } from './../../service/confirm-modal.service';
import { StoreModalService } from './../../service/store-modal.service';
import { StoreService, IStore } from './store.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-management',
  templateUrl: './store-management.component.html',
  styleUrls: ['./store-management.component.css'],
})
export class StoreManagementComponent implements OnInit {
  stores: IStore[] = [];
  confirmModalRef: MDBModalRef;

  constructor(
    private storeService: StoreService,
    private storeModalService: StoreModalService,
    private confirmService: ConfirmModalService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchStores();
    this.storeService.updateObservable$.subscribe((store: IStore) => {
      const index: number = this.stores.findIndex(s => s.id === store.id);
      this.stores[index] = store;
    })
  }

  fetchStores(): void {
    this.storeService.fetchStores().subscribe((stores) => {
      this.stores = stores;
    });
  }

  showDetailsModal(id: number): void {
    this.storeService.fetchById(id).subscribe((store) => {
      this.storeModalService.showDetailsModal(store);
    });
  }

  showUpdateModal(id: number): void {
    this.storeService.fetchById(id).subscribe((store) => {
      this.storeModalService.showUpdateModal(store);
    });
  }

  deleteStore(id: number): void {
    this.confirmService.show().onYes(() => {
        this.storeService.deleteById(id).subscribe(() => {
          this.stores = this.stores.filter(store => store.id !== id);
          this.notiService.showSuccess('Delete successfully!');
        })
    })
  }
}
