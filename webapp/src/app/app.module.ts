import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module'

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
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [ContentComponent]
})
export class AppModule { }