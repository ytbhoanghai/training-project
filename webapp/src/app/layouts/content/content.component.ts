import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/auth/user.service';
import {ToastService} from "ng-uikit-pro-standard";

@Component({
  selector: 'app-root',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor(private userService: UserService, private toastService: ToastService) { }

  ngOnInit(): void {
  }

  getUser(): void {
    console.log(this.userService.getCurrentUser());
  }
}
