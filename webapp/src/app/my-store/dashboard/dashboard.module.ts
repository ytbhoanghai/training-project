import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreCardComponent } from './store-card/store-card.component';

@NgModule({
  declarations: [StoreCardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: DashboardComponent },
    ]),
  ],
  exports: [StoreCardComponent]
})
export class DashboardModule {}
