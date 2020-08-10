import { CheckLoginGuard } from './../config/guard/check-login.guard';
import { CartCheckoutComponent } from './cart-checkout/cart-checkout.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShoppingComponent } from './shopping.component';

const routes: Routes = [
  // { path: '', redirectTo: 'category/all' },
  // { path: 'category/:id', component: ShoppingComponent },
  {
    path: '',
    component: ShoppingComponent,
    children: [
      { path: '', pathMatch: 'full', component: ShoppingComponent },
      {
        path: 'store/:storeId/category/:categoryId',
        component: ProductsListComponent,
      },
      { path: 'cart', component: CartDetailComponent },
      {
        path: 'checkout',
        canActivate: [CheckLoginGuard],
        component: CartCheckoutComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingRoutingModule {}
