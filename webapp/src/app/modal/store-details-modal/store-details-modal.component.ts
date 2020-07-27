import { StoreModalService } from './../../service/store-modal.service';
import { Component, OnInit } from '@angular/core';
import { IStore } from 'src/app/manager/store-management/store.service';

@Component({
  selector: 'app-store-details-modal',
  templateUrl: './store-details-modal.component.html',
  styleUrls: ['./store-details-modal.component.css']
})
export class StoreDetailsModalComponent implements OnInit {
  store: IStore;

  constructor(private storeModalService: StoreModalService) { }

  ngOnInit(): void {
  }

  hideModal(): void {
    this.storeModalService.hideDetailsModal();
  }

}
