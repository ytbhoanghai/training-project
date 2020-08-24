import { ADMIN, MANAGER } from './core/constants/role.constants';
import { CheckLoginGuard } from './config/guard/check-login.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckAuthoritiesGuard } from './config/guard/check-authorities.guard';

import { errorRoute } from './layouts/error/error.route';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    // loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
    redirectTo: 'shopping',
  },
  {
    path: 'admin',
    canActivate: [CheckAuthoritiesGuard],
    loadChildren: () =>
      import('./manager/manager-routing.module').then(
        (m) => m.ManagerRoutingModule
      ),
    data: {
      role: [ADMIN, MANAGER],
    },
  },
  {
    path: 'my-store',
    canActivate: [CheckLoginGuard, CheckAuthoritiesGuard],
    loadChildren: () =>
      import('./my-store/my-store-routing.module').then(
        (m) => m.MyStoreRoutingModule
      ),
    data: {
      role: [MANAGER],
    },
  },
  {
    path: 'shopping',
    loadChildren: () =>
      import('./shopping/shopping-routing.module').then(
        (m) => m.ShoppingRoutingModule
      ),
  },
  {
    path: 'account',
    canActivate: [CheckLoginGuard],
    loadChildren: () =>
      import('./account/account-routing.module').then(
        (m) => m.AccountRoutingModule
      ),
  },
  ...errorRoute,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
