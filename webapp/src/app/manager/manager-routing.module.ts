import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'user-management',
    loadChildren: () =>
      import('./user-management/user-management.module').then(
        (m) => m.UserManagementModule
      ),
  },
  {
    path: 'role-management',
    loadChildren: () =>
      import('./role-management/role-management.module').then(
        (m) => m.RoleManagementModule
      ),
  },
  {
    path: 'store-management',
    loadChildren: () =>
      import('./store-management/store-management.module').then(
        (m) => m.StoreManagementModule
      ),
  },
  {
    path: 'product-management',
    loadChildren: () =>
      import('./product-management/product-management.module').then(
        (m) => m.ProductManagementModule
      ),
  },
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
