import { NotificationService } from './../../layouts/notification/notification.service';
import { StoreService } from './../../manager/store-management/store.service';
import { UserManagementService } from './../../manager/user-management/user-management.service';
import { UserModalService } from './../../service/user-modal.service';
import { FormType } from '../../manager/user-management/user-add/user-form.component';
import { Component, OnInit } from '@angular/core';
import { IUser } from '../../core/auth/user.service';

@Component({
  selector: 'app-user-add-modal',
  templateUrl: './user-add-modal.component.html',
  styleUrls: ['./user-add-modal.component.css'],
})
export class UserAddModalComponent implements OnInit {
  user: IUser;
  storeId: number;
  type = FormType;

  constructor(
    private userModalService: UserModalService,
    private userService: UserManagementService,
    private storeService: StoreService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {}

  handleSubmit(user: IUser): void {
    this.storeService.addStaffToStore(user).subscribe((addedUser) => {
      this.userService.userAddSubject.next(addedUser);
      this.hideModal();
      this.notiService.showSuccess('Added staff to store');
    });
  }

  hideModal(): void {
    this.userModalService.hideAddModal();
  }
}
