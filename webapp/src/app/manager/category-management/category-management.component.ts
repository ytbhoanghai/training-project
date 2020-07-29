import { Component, OnInit } from '@angular/core';
import {CategoryService, ICategory} from "./category.service";
import {CategoryModalService} from "../../service/category-modal.service";
import {NotificationService} from "../../layouts/notification/notification.service";
import {ConfirmModalService} from "../../service/confirm-modal.service";

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  categories: ICategory[] = [];

  constructor(
    private categoryService: CategoryService,
    private categoryModalService: CategoryModalService,
    private notiService: NotificationService,
    private confirmService: ConfirmModalService
  ) { }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.fetchCategories().subscribe(categories => {
      this.categories = categories;
    })
  }

  showDetailsModal(id: number): void {
    this.categoryService.fetchCategoryById(id).subscribe(category => {
      this.categoryModalService.showDetailsModal(category);
    })
  }

  showUpdateModal(id: number): void {
    this.categoryService.fetchCategoryById(id).subscribe(category => {
      this.categoryModalService.showUpdateModal(category);
    })
  }

  deleteCategory(id: number): void {
    this.confirmService.show('DeleteCategory');
  }

}
