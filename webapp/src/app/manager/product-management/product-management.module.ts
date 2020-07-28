import { ReactiveFormsModule } from '@angular/forms';
import { ProductManagementComponent } from './product-management.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductFormComponent } from './product-form/product-form.component';

@NgModule({
  declarations: [ProductAddComponent, ProductFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: ProductManagementComponent },
      { path: 'new', component: ProductAddComponent },
    ]),
  ],
  exports: [ProductFormComponent],
})
export class ProductManagementModule {}
