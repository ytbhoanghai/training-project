import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryManagementComponent } from './category-management.component';
import { CategoryFormComponent } from './category-form/category-form.component';



@NgModule({
  declarations: [CategoryFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: CategoryManagementComponent
      }
    ])
  ],
  exports: [CategoryFormComponent]
})
export class CategoryManagementModule { }
