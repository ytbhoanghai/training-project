import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module'
import {MDBBootstrapModulesPro, ToastModule} from 'ng-uikit-pro-standard';
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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ViewRoleDetailsManagementComponent } from './modal/view-role-details-management/view-role-details-management.component';
import { ConfirmModalComponent } from './modal/confirm-modal/confirm-modal.component';
import {UserManagementModule} from "./manager/user-management/user-management.module";
import { ToastrModule } from 'ngx-toastr';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { UserDetailsModalComponent } from './modal/user-details-modal/user-details-modal.component';
import { UserUpdateModalComponent } from './modal/user-update-modal/user-update-modal.component';
import { RoleUpdateModalComponent } from './modal/role-update-modal/role-update-modal.component';

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
    RoleUpdateModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    NgbModule,
    MDBBootstrapModulesPro.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    UserManagementModule,
    ToastModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  entryComponents: [LoginModalComponent],
  providers: [MDBSpinningPreloader],
  bootstrap: [ContentComponent]
})
export class AppModule { }
