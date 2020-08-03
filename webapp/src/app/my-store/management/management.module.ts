import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ManagementComponent } from './management.component';
import { StoreProductComponent } from './store-product/store-product.component';
import { StoreStaffsComponent } from './store-staffs/store-staffs.component';

@NgModule({
  declarations: [StoreProductComponent, StoreStaffsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: ManagementComponent },
      { path: 'products', component: StoreProductComponent, outlet: 'tabs' },
      { path: 'staffs', component: StoreStaffsComponent, outlet: 'tabs' },
    ]),
  ],
  exports: [StoreProductComponent, StoreStaffsComponent],
})
export class ManagementModule {}
