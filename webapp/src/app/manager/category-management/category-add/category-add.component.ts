import { NotificationService } from './../../../layouts/notification/notification.service';
import { ICategory, CategoryService } from './../category.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css'],
})
export class CategoryAddComponent implements OnInit {
  constructor(
    private location: Location,
    private categoryService: CategoryService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {}

  back(): void {
    this.location.back();
  }

  handleSubmit(body: ICategory) {
    this.categoryService.save(body).subscribe(category => {
      this.back();
      this.notiService.showSuccess();
      this.categoryService.updateSubject.next(category);
    })
  }
}
