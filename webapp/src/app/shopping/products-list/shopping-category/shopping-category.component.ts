import { ActivatedRoute } from '@angular/router';
import {
  ICategory,
  CategoryService,
} from './../../../manager/category-management/category.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-category',
  templateUrl: './shopping-category.component.html',
  styleUrls: ['./shopping-category.component.css'],
})
export class ShoppingCategoryComponent implements OnInit {
  categories: ICategory[] = [];
  storeId: number;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.route.params.subscribe(params => {
      this.storeId = +params.storeId;
    })
  }

  fetchCategories(): void {
    this.categoryService.fetchCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }
}
