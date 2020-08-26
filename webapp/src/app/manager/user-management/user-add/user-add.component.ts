import { HttpErrorResponse } from '@angular/common/http';
import { IUser } from 'src/app/core/auth/user.service';
import { FormType } from 'src/app/manager/user-management/user-add/user-form.component';
import { NotificationService } from './../../../layouts/notification/notification.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserManagementService } from '../user-management.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
})
export class UserAddComponent implements OnInit {
  type = FormType;

  constructor(
    private location: Location,
    private userService: UserManagementService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {}

  back(): void {
    this.location.back();
  }

  handleSubmit(user: IUser): void {
    this.userService.saveFromAdmin(user).subscribe((addedUser) => {
      this.notiService.showSuccess('Added successfully!');
      this.back();
    }, (err: HttpErrorResponse) => {
      if (err.status === 500) {
        this.notiService.showError('Existed username');
      }
    });
  }
}
