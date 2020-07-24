import { RoleManagementComponent } from './role-management.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoleCreateComponent } from './role-create/role-create.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [RoleCreateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: RoleManagementComponent},
      {path: 'create', component: RoleCreateComponent}
    ]),
    FormsModule,
  ],
})
export class RoleManagementModule {}
