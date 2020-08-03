import { Component, OnInit } from '@angular/core';
import {CategoryService, ICategory} from "../../manager/category-management/category.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-shopping-category',
  templateUrl: './shopping-category.component.html',
  styleUrls: ['./shopping-category.component.css']
})
export class ShoppingCategoryComponent implements OnInit {
  categories: ICategory[] = [];
  categories$: Observable<ICategory[]>;

  constructor(private categoryService: CategoryService) {
    this.categories$ = this.categoryService.fetchCategories();
  }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.fetchCategories().subscribe(categories => {
      this.categories = categories;
    })
  }

}
