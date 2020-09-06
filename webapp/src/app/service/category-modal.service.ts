import { CategoryAddModalComponent } from './../modal/category-add-modal/category-add-modal.component';
import { CategoryUpdateComponent } from './../modal/category-update/category-update.component';
import { CategoryDetailsComponent } from './../modal/category-details/category-details.component';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { Injectable } from '@angular/core';
import { ICategory } from '../core/models';

@Injectable({
  providedIn: 'root',
})
export class CategoryModalService {
  private modalDetailsRef: MDBModalRef;
  private modalUpdateRef: MDBModalRef;
  private modalAddRef: MDBModalRef;

  private options = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: false,
    ignoreBackdropClick: false,
    class: '',
    containerClass: '',
    animated: true,
    data: {},
  };

  constructor(private modalService: MDBModalService) {}

  showAddModal(storeId: number): void {
    this.options.data = { storeId };
    this.modalAddRef = this.modalService.show(
      CategoryAddModalComponent,
      this.options
    );
  }

  hideAddModal(): void {
    this.modalAddRef.hide();
  }

  showDetailsModal(category: ICategory): void {
    this.options.data = { category };
    this.modalDetailsRef = this.modalService.show(
      CategoryDetailsComponent,
      this.options
    );
  }

  showUpdateModal(category: ICategory): void {
    this.options.data = { category };
    this.modalUpdateRef = this.modalService.show(
      CategoryUpdateComponent,
      this.options
    );
  }

  hideDetailsModal(): void {
    this.modalDetailsRef.hide();
  }

  hideUpdateModal(): void {
    this.modalUpdateRef.hide();
  }
}
