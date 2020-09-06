import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryManagementComponent } from './category-management.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryAddComponent } from './category-add/category-add.component';

@NgModule({
  declarations: [CategoryFormComponent, CategoryAddComponent],
  imports: [
    CommonModule,

    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: CategoryManagementComponent,
      },
      { path: 'new', component: CategoryAddComponent },
    ]),
  ],
  exports: [CategoryFormComponent],
})
export class CategoryManagementModule {}
