import { Component, OnInit } from '@angular/core';
import {ICategory} from "../../manager/category-management/category.service";
import {CategoryModalService} from "../../service/category-modal.service";

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent implements OnInit {
  category: ICategory;

  constructor(private categoryModalService: CategoryModalService) { }

  ngOnInit(): void {
  }

  hideModal(): void {
    this.categoryModalService.hideDetailsModal();
  }

}
