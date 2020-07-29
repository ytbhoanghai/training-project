import { Component, OnInit } from '@angular/core';
import {CategoryModalService} from "../../service/category-modal.service";
import {CategoryService, ICategory} from "../../manager/category-management/category.service";
import {NotificationService} from "../../layouts/notification/notification.service";

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.css']
})
export class CategoryUpdateComponent implements OnInit {
  category: ICategory;

  constructor(
    private categoryModalService: CategoryModalService,
    private categoryService: CategoryService,
    private notiService: NotificationService
  ) { }

  ngOnInit(): void {
  }

  hideModal(): void {
    this.categoryModalService.hideUpdateModal();
  }

  handleSubmit(id: number, body: ICategory): void {
    this.categoryService.update(id, body).subscribe(category => {
      this.notiService.showSuccess();
      this.hideModal();
      this.categoryService.updateSubject.next(category);
    })
  }
}
