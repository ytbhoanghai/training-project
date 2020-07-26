import { Component, OnInit } from '@angular/core';
import {IUser} from "../../core/auth/user.service";
import {UserManagementService} from "../../manager/user-management/user-management.service";
import {UserModalService} from "../../service/user-modal.service";

@Component({
  selector: 'app-user-update-modal',
  templateUrl: './user-update-modal.component.html',
  styleUrls: ['./user-update-modal.component.css']
})
export class UserUpdateModalComponent implements OnInit {
  user: IUser;

  constructor(
    private userService: UserManagementService,
    private modalService: UserModalService) { }

  ngOnInit(): void {
    console.log(this.user)
  }

  handleSubmit(id: number, user: IUser): void {
    this.userService.update(id, user).subscribe(user => {
      console.log("UPDATED: ", user)
      this.modalService.userUpdateModalRef.hide();
    })
  }

  hideModal(): void {
    this.modalService.userUpdateModalRef.hide();
  }

}
