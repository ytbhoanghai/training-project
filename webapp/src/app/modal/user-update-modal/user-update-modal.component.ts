import { NotificationService } from './../../layouts/notification/notification.service';
import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../../manager/user-management/user-management.service';
import { UserModalService } from '../../service/user-modal.service';
import { FormType } from 'src/app/manager/user-management/user-add/user-form.component';
import { IUser } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-user-update-modal',
  templateUrl: './user-update-modal.component.html',
  styleUrls: ['./user-update-modal.component.css'],
})
export class UserUpdateModalComponent implements OnInit {
  user: IUser;
  type = FormType;

  constructor(
    private userService: UserManagementService,
    private modalService: UserModalService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {
    console.log(this.user);
  }

  handleSubmit(id: number, user: IUser): void {
    this.userService.update(id, user).subscribe((newUser) => {
      this.modalService.userUpdateModalRef.hide();
      this.notiService.showSuccess();
      newUser.id = id;
      this.userService.updateSubject.next(newUser);
    });
  }

  hideModal(): void {
    this.modalService.userUpdateModalRef.hide();
  }
}
