import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckAuthoritiesGuard } from './config/guard/check-authorities.guard';

import { errorRoute } from './layouts/error/error.route';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'manager',
    canActivate: [CheckAuthoritiesGuard],
    loadChildren: () =>
      import('./manager/manager-routing.module').then(
        (m) => m.ManagerRoutingModule
      ),
  },
  ...errorRoute,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}