import { SettingsComponent } from './account/settings/settings.component';
import { ShoppingStoreComponent } from './shopping/products-list/shopping-store/shopping-store.component';
import { ProductCardComponent } from './shopping/products-list/product-card/product-card.component';
import { ShoppingCategoryComponent } from './shopping/products-list/shopping-category/shopping-category.component';
import { ManagementComponent } from './my-store/management/management.component';
import { ManagementModule } from './my-store/management/management.module';
import { DashboardModule } from './my-store/dashboard/dashboard.module';
import { CategoryManagementModule } from './manager/category-management/category-management.module';
import { ProductManagementModule } from './manager/product-management/product-management.module';
import { RoleManagementModule } from './manager/role-management/role-management.module';
import { StoreManagementModule } from './manager/store-management/store-management.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { MDBBootstrapModulesPro, ToastModule } from 'ng-uikit-pro-standard';
import { MDBSpinningPreloader } from 'ng-uikit-pro-standard';

import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './layouts/header/header.component';
import { ContentComponent } from './layouts/content/content.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { ErrorComponent } from './layouts/error/error.component';
import { UserManagementComponent } from './manager/user-management/user-management.component';
import { RoleManagementComponent } from './manager/role-management/role-management.component';
import { StoreManagementComponent } from './manager/store-management/store-management.component';
import { ProductManagementComponent } from './manager/product-management/product-management.component';
import { CategoryManagementComponent } from './manager/category-management/category-management.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { LoginModalComponent } from './modal/login-modal/login-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewRoleDetailsManagementComponent } from './modal/view-role-details-management/view-role-details-management.component';
import { ConfirmModalComponent } from './modal/confirm-modal/confirm-modal.component';
import { UserManagementModule } from './manager/user-management/user-management.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserDetailsModalComponent } from './modal/user-details-modal/user-details-modal.component';
import { UserUpdateModalComponent } from './modal/user-update-modal/user-update-modal.component';
import { RoleUpdateModalComponent } from './modal/role-update-modal/role-update-modal.component';
import { StoreUpdateModalComponent } from './modal/store-update-modal/store-update-modal.component';
import { StoreDetailsModalComponent } from './modal/store-details-modal/store-details-modal.component';
import { ProductDetailsComponent } from './modal/product-details/product-details.component';
import { ProductUpdateComponent } from './modal/product-update/product-update.component';
import { CategoryDetailsComponent } from './modal/category-details/category-details.component';
import { CategoryUpdateComponent } from './modal/category-update/category-update.component';
import { DashboardComponent } from './my-store/dashboard/dashboard.component';
import { ShoppingComponent } from './shopping/shopping.component';
import { ShoppingCartComponent } from './shopping/shopping-cart/shopping-cart.component';
import { CartDetailComponent } from './shopping/cart-detail/cart-detail.component';
import { ProductsListComponent } from './shopping/products-list/products-list.component';
import { CartCheckoutComponent } from './shopping/cart-checkout/cart-checkout.component';
import { CartDetailItemComponent } from './shopping/cart-detail/cart-detail-item/cart-detail-item.component';
import { StripeFormComponent } from './shopping/cart-checkout/stripe-form/stripe-form.component';
import { UserCheckoutFormComponent } from './shopping/cart-checkout/user-checkout-form/user-checkout-form.component';
import { PaymentModalComponent } from './modal/payment-modal/payment-modal.component';
import { ShoppingOrderComponent } from './shopping/shopping-order/shopping-order.component';
import { PaginationComponent } from './shopping/products-list/pagination/pagination.component';
import { RegisterFormComponent } from './modal/login-modal/register-form/register-form.component';
import { LoadingComponent } from './layouts/loading/loading.component';
import { ShoppingDetailsComponent } from './modal/shopping-details/shopping-details.component';

@NgModule({
  declarations: [
    HeaderComponent,
    ContentComponent,
    FooterComponent,
    ErrorComponent,
    UserManagementComponent,
    RoleManagementComponent,
    StoreManagementComponent,
    ProductManagementComponent,
    CategoryManagementComponent,
    HomeComponent,
    LoginModalComponent,
    ViewRoleDetailsManagementComponent,
    ConfirmModalComponent,
    UserDetailsModalComponent,
    UserUpdateModalComponent,
    RoleUpdateModalComponent,
    StoreUpdateModalComponent,
    StoreDetailsModalComponent,
    ProductDetailsComponent,
    ProductUpdateComponent,
    CategoryDetailsComponent,
    CategoryUpdateComponent,
    DashboardComponent,
    ManagementComponent,
    ShoppingComponent,
    ShoppingCategoryComponent,
    ProductCardComponent,
    ShoppingCartComponent,
    ShoppingStoreComponent,
    CartDetailComponent,
    ProductsListComponent,
    CartCheckoutComponent,
    CartDetailItemComponent,
    StripeFormComponent,
    UserCheckoutFormComponent,
    PaymentModalComponent,
    ShoppingOrderComponent,
    PaginationComponent,
    RegisterFormComponent,
    ShoppingOrderComponent,
    SettingsComponent,
    LoadingComponent,
    ShoppingDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    UserManagementModule,
    StoreManagementModule,
    RoleManagementModule,
    ProductManagementModule,
    CategoryManagementModule,
    DashboardModule,
    ManagementModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    ToastrModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
  ],
  entryComponents: [LoginModalComponent],
  providers: [MDBSpinningPreloader],
  bootstrap: [ContentComponent],
})
export class AppModule {}
