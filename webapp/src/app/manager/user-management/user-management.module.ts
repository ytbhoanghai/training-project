import { UserManagementComponent } from './user-management.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserAddComponent } from './user-add/user-add.component';
import { UserFormComponent } from './user-add/user-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserAddComponent, UserFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: UserManagementComponent },
      { path: 'new', component: UserAddComponent },
    ]),
    ReactiveFormsModule,
  ],
  exports: [UserFormComponent],
})
export class UserManagementModule {}
