import { RoleManagementComponent } from './role-management.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: RoleManagementComponent }]),
  ],
})
export class RoleManagementModule {}
