import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {IUser} from "../../../core/auth/user.service";
import {UserManagementService} from "../user-management.service";

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {

  constructor(
    private location: Location,
    private userService: UserManagementService) { }

  ngOnInit(): void {
  }

  back(): void {
    this.location.back();
  }

  handleSubmit(user): void {
    console.log("RECEIVED", user)
    this.userService.save(user).subscribe(user => {
      console.log("SAVED", user)
      this.back();
    })
  }

}
