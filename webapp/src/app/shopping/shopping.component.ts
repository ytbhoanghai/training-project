import { Component, OnInit } from '@angular/core';
import {UserService} from "../core/auth/user.service";

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css'],
})
export class ShoppingComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  isLogin(): boolean {
    return this.userService.isLogin();
  }
}
