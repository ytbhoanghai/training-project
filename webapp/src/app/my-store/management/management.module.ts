import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ManagementComponent } from './management.component';
import { StoreProductComponent } from './store-product/store-product.component';
import { StoreStaffsComponent } from './store-staffs/store-staffs.component';
import { StoreOrdersComponent } from './store-orders/store-orders.component';
import { StoreStatisticsComponent } from './store-statistics/store-statistics.component';

@NgModule({
  declarations: [
    StoreProductComponent,
    StoreStaffsComponent,
    StoreOrdersComponent,
    StoreStatisticsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ManagementComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'products' },
          { path: 'products', component: StoreProductComponent },
          { path: 'staffs', component: StoreStaffsComponent },
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
  ],
})
export class ManagementModule {}
