import { NotificationService } from 'src/app/layouts/notification/notification.service';
import { StoreService } from './../../manager/store-management/store.service';
import { IStore } from 'src/app/manager/store-management/store.service';
import { StoreModalService } from './../../service/store-modal.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-update-modal',
  templateUrl: './store-update-modal.component.html',
  styleUrls: ['./store-update-modal.component.css'],
})
export class StoreUpdateModalComponent implements OnInit {
  store: IStore;

  constructor(
    private storeService: StoreService,
    private storeModalService: StoreModalService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {}

  handleSubmit(id: number, store: IStore): void {
    this.storeService.update(id, store).subscribe((store) => {
      this.storeModalService.hideUpdateModal();
      this.notiService.showSuccess();
    });
  }

  hideModal(): void {
    this.storeModalService.hideUpdateModal();
  }
}
