import { UserManagementComponent } from './user-management.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: UserManagementComponent }]),
  ],
})
export class UserManagementModule {}
