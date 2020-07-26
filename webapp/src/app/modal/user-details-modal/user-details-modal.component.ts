import {Component, Input, OnInit} from '@angular/core';
import {MDBModalRef} from "ng-uikit-pro-standard";
import {UserModalService} from "../../service/user-modal.service";
import {IUser} from "../../core/auth/user.service";

@Component({
  selector: 'app-user-details-modal',
  templateUrl: './user-details-modal.component.html',
  styleUrls: ['./user-details-modal.component.css']
})
export class UserDetailsModalComponent implements OnInit {
  user: IUser;

  constructor(private userModalService: UserModalService) {
  }

  ngOnInit(): void {
  }

  hideModal(): void {
    this.userModalService.userDetailsModalRef.hide();
  }

}
