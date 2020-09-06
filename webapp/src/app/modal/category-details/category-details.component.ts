import { Component, OnInit } from '@angular/core';
import { CategoryModalService } from '../../service/category-modal.service';
import { ICategory } from 'src/app/core/models';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css'],
})
export class CategoryDetailsComponent implements OnInit {
  category: ICategory;

  constructor(private categoryModalService: CategoryModalService) {}

  ngOnInit(): void {}

  hideModal(): void {
    this.categoryModalService.hideDetailsModal();
  }
}
