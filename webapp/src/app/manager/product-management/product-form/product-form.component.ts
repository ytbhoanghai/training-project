import { NotificationService } from 'src/app/layouts/notification/notification.service';
import { CategoryService } from '../../category-management/category.service';
import { IProduct } from 'src/app/core/models';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ICategory } from 'src/app/core/models';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  @Input() product: IProduct;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();

  categories: ICategory[] = [];

  productForm = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(4)]],
    price: [1, [Validators.required, Validators.min(0)]],
    quantity: [1, [Validators.min(0), Validators.max(1000)]],
    categories: [[]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fillFormDataIfExisted();
  }

  fetchCategories(): void {
    this.categoryService.fetchCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  fillFormDataIfExisted(): void {
    if (!this.product) return;
    this.productForm.patchValue({
      ...this.product,
      categories: this.product.categories.map((c) => c.id),
    });
  }

  emitSubmitEvent(): void {
    if (this.productForm.valid) {
      this.onSubmit.emit(this.productForm.value);
      return;
    }
    this.notiService.showWaring('Invalid form. Please check again!');
  }
}
