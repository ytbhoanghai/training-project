import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IPageableProduct } from 'src/app/service/customer.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() pagination: IPageableProduct;
  pages: number[] = [];

  constructor() {}

  ngOnInit(): void {
    this.convertInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.convertInput();
  }

  convertInput(): void {
    this.pages = [];
    for (let i = 1; i <= this.pagination.totalPages; i++) {
      this.pages.push(i);
    }
  }

  isFirstPage(): boolean {
    return this.pagination.currentPage === 1;
  }

  isLastPage(): boolean {
    return this.pagination.currentPage === this.pagination.totalPages;
  }
}
