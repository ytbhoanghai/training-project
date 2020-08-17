import { UsdPipe } from './../app/core/pipes/usd.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [UsdPipe],
  imports: [CommonModule],
  exports: [UsdPipe],
})
export class SharedModule {}
