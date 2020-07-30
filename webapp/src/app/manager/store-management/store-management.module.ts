import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreFormComponent } from './store-form/store-form.component';
import { StoreManagementComponent } from './store-management.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreAddComponent } from './store-add/store-add.component';

@NgModule({
  declarations: [StoreAddComponent, StoreFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: StoreManagementComponent },
      {
        path: 'new',
        component: StoreAddComponent,
      },
    ]),
    ReactiveFormsModule
  ],
  exports: [StoreAddComponent, StoreFormComponent]
})
export class StoreManagementModule {}
