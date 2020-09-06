import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IPageableProduct } from 'src/app/core/models';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() pagination: IPageableProduct;
  pages: number[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.convertInput();
  }

  ngOnChanges(): void {
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
