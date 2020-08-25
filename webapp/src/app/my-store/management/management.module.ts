import { ProductAddComponent } from './../../manager/product-management/product-add/product-add.component';
import { SharedModule } from './../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ManagementComponent } from './management.component';
import { StoreProductComponent } from './store-product/store-product.component';
import { StoreStaffsComponent } from './store-staffs/store-staffs.component';
import { StoreOrdersComponent } from './store-orders/store-orders.component';
import { StoreStatisticsComponent } from './store-statistics/store-statistics.component';
import { StoreRolesComponent } from './store-roles/store-roles.component';
import { StoreCategoriesComponent } from './store-categories/store-categories.component';

@NgModule({
  declarations: [
    StoreProductComponent,
    StoreStaffsComponent,
    StoreOrdersComponent,
    StoreStatisticsComponent,
    StoreRolesComponent,
    StoreCategoriesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ManagementComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'products' },
          { path: 'products', component: StoreProductComponent },
          { path: 'categories', component: StoreCategoriesComponent },
          { path: 'staffs', component: StoreStaffsComponent },
          { path: 'roles', component: StoreRolesComponent },
          { path: 'orders', component: StoreOrdersComponent },
          { path: 'statistics', component: StoreStatisticsComponent },
        ],
      },
    ]),
  ],
  exports: [
    StoreProductComponent,
    StoreStaffsComponent,
    StoreOrdersComponent,
    StoreStatisticsComponent,
    StoreRolesComponent,
    StoreCategoriesComponent
  ],
})
export class ManagementModule {}
