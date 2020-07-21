import { ErrorComponent } from './error.component';
import { Routes } from '@angular/router';

export const errorRoute: Routes = [
  {
    path: 'error',
    component: ErrorComponent,
    data: {
      errorMessage: 'Error! Please try again',
    },
  },
  {
    path: 'accessdenied',
    component: ErrorComponent,
    data: {
      errorMessage: '401! Unauthorized',
    },
  },
  {
    path: '404',
    component: ErrorComponent,
    data: {
      errorMessage: '404! Page not found',
    },
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
