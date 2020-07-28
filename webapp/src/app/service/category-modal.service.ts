import { CategoryUpdateComponent } from './../modal/category-update/category-update.component';
import { CategoryDetailsComponent } from './../modal/category-details/category-details.component';
import { ICategory } from './../manager/category-management/category.service';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryModalService {
  private detailsModalRef: MDBModalRef;
  private updateModalRef: MDBModalRef;

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

  constructor(private modalService: MDBModalService) { }

  showDetailsModal(category: ICategory): void {
    this.options.data = { category };
    this.detailsModalRef = this.modalService.show(CategoryDetailsComponent, this.options);
  }

  showUpdateModal(category: ICategory): void {
    this.options.data = { category };
    this.updateModalRef = this.modalService.show(CategoryUpdateComponent, this.options);
  }

  hideDetailsModal(): void {
    this.detailsModalRef.hide();
  }

  hideUpdateModal(): void {
    this.updateModalRef.hide();
  }
}
