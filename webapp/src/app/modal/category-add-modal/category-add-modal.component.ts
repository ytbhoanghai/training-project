import { CategoryModalService } from './../../service/category-modal.service';
import { CategoryService } from '../../manager/category-management/category.service';
import { Component, OnInit } from '@angular/core';
import { ICategory } from 'src/app/core/models';

@Component({
  selector: 'app-category-add-modal',
  templateUrl: './category-add-modal.component.html',
  styleUrls: ['./category-add-modal.component.css'],
})
export class CategoryAddModalComponent implements OnInit {
  storeId: number;

  constructor(
    private categoryService: CategoryService,
    private categoryModalService: CategoryModalService
  ) {}

  ngOnInit(): void {}

  handleSubmit(body: ICategory): void {
    body.storeId = this.storeId;
    this.categoryService.save(body).subscribe((category) => {
      this.categoryService.addedSubject.next(category);
      this.hideModal();
    });
  }

  hideModal(): void {
    this.categoryModalService.hideAddModal();
  }
}
