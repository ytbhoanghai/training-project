import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryManagementComponent } from './category-management.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CategoryManagementComponent
      }
    ])
  ]
})
export class CategoryManagementModule { }
