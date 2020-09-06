import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../manager/category-management/category.service';
import { Component, OnInit } from '@angular/core';
import { ICategory } from 'src/app/core/models';

@Component({
  selector: 'app-shopping-category',
  templateUrl: './shopping-category.component.html',
  styleUrls: ['./shopping-category.component.css'],
})
export class ShoppingCategoryComponent implements OnInit {
  categories: ICategory[] = [];
  storeId: number;
  categoryId: string;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.route.params.subscribe((params) => {
      this.storeId = +params.storeId;
      this.checkActive();
    });

    this.route.queryParams.subscribe((query) => {
      this.checkActive();
    });
  }

  checkActive(): void {
    this.categoryId = this.route.snapshot.paramMap.get('categoryId');
    this.categories.forEach((c) => {
      if (c.id === +this.categoryId) {
        c.isActive = true;
      } else {
        c.isActive = false;
      }
    });
  }

  fetchCategories(): void {
    this.categoryService.fetchCategories().subscribe((categories) => {
      this.categories = categories;
      this.checkActive();
    });
  }
}
