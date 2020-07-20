import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management/user-management.component';
import { CategoryManagementComponent } from './category-management/category-management.component';

const routes: Routes = [
  { path: 'user-management', component: UserManagementComponent },
  {
    path: 'category-management',
    loadChildren: () =>
      import('./category-management/category-management.module').then(
        (m) => m.CategoryManagementModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerRoutingModule {}
