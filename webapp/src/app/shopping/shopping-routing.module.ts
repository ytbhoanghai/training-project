import { CartCheckoutComponent } from './cart-checkout/cart-checkout.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
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
      { path: '', redirectTo: 'category/all' },
      { path: 'category/:id', component: ProductsListComponent },
      { path: 'cart', component: CartDetailComponent },
      { path: 'checkout', component: CartCheckoutComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingRoutingModule {}
