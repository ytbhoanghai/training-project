/* eslint-disable @typescript-eslint/no-unused-vars */
import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usd'
})
export class UsdPipe extends CurrencyPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    return super.transform(value, 'USD', true, '1.0-2');
  }

}
