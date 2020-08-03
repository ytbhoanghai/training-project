import { LocalCartService } from './../../service/local-cart.service';
import {Component, Input, OnInit} from '@angular/core';
import {IProduct} from "../../manager/product-management/product.service";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() product: IProduct;

  constructor(private localCartService: LocalCartService) { }

  ngOnInit(): void {
  }

  addToCart(): void {
    this.localCartService.addItem(this.product);
    console.log(this.localCartService.getItems())
  }
}
