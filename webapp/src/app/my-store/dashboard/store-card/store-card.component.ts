import { StoreModalService } from './../../../service/store-modal.service';
import { StoreService } from './../../../manager/store-management/store.service';
import { Component, OnInit, Input } from '@angular/core';
import { IStore, StatusType } from 'src/app/core/models';

@Component({
  selector: 'app-store-card',
  templateUrl: './store-card.component.html',
  styleUrls: ['./store-card.component.css'],
})
export class StoreCardComponent implements OnInit {
  @Input() store: IStore;

  constructor(
    private storeService: StoreService,
    private storeModalService: StoreModalService
  ) {}

  ngOnInit(): void {}

  isClosed(): boolean {
    return this.store.status.toString() === StatusType[StatusType.Open];
  }

  showDetailsModal(id: number): void {
    this.storeService.fetchById(id).subscribe((store) => {
      this.storeModalService.showDetailsModal(store);
    });
  }
}
