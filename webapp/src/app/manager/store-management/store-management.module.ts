import { StoreManagementComponent } from './store-management.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: StoreManagementComponent }]),
  ],
})
export class StoreManagementModule {}
