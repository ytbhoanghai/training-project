import { RoleManagementComponent } from './role-management.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoleCreateComponent } from './role-create/role-create.component';
import {FormsModule} from "@angular/forms";
import { RoleTableComponent } from './role-table/role-table.component';

@NgModule({
  declarations: [RoleCreateComponent, RoleTableComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: RoleManagementComponent},
      {path: 'create', component: RoleCreateComponent}
    ]),
    FormsModule,
  ],
  exports: [RoleTableComponent]
})
export class RoleManagementModule {}
