import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../layouts/notification/notification.service';
import { ICategory } from 'src/app/core/models';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit {
  @Input() category: ICategory;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();

  categoryForm = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(4)]],
    description: [''],
  });

  constructor(
    private formBuilder: FormBuilder,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {
    this.fillDataOnUpdate();
  }

  fillDataOnUpdate(): void {
    if (!this.category) return;
    this.categoryForm.patchValue(this.category);
  }

  emitSubmitEvent(): void {
    if (this.categoryForm.valid) {
      this.onSubmit.emit(this.categoryForm.value);
      return;
    }
    this.notiService.showWaring('Invalid form. Please check again');
  }
}
