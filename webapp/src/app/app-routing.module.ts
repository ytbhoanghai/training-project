import { ADMIN, MANAGER, CUSTOMER } from './core/constants/role.constants';
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
    redirectTo: 'account/login',
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
    canActivate: [CheckAuthoritiesGuard],
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
    // canActivate: [CheckAuthoritiesGuard],
    loadChildren: () =>
      import('./shopping/shopping-routing.module').then(
        (m) => m.ShoppingRoutingModule
      ),
    data: {
      role: [CUSTOMER],
    },
  },
  {
    path: 'account',
    // canActivate: [CheckLoginGuard],
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
