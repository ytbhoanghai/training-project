import { ConfirmModalService } from './../../service/confirm-modal.service';
import { Component, OnInit } from '@angular/core';
import { UserManagementService } from './user-management.service';
import { IUser } from '../../core/auth/user.service';
import { UserModalService } from '../../service/user-modal.service';
import { NotificationService } from '../../layouts/notification/notification.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: IUser[] = [];

  constructor(
    private userService: UserManagementService,
    private userModalService: UserModalService,
    private notiService: NotificationService,
    private confirmService: ConfirmModalService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.userService.updateObservable$.subscribe((user: IUser) => {
      const index: number = this.users.findIndex((u) => u.id === user.id);
      this.users[index] = { ...this.users[index], ...user };
    });
  }

  fetchUsers(): void {
    this.userService.fetchAll().subscribe((users) => {
      users.sort((a, b) => a?.storeName.localeCompare(b?.storeName));
      users.reverse();
      this.users = users;
    });
  }

  deleteUser(id: number): void {
    this.confirmService.show().onYes(() => {
      this.userService.delete(id).subscribe(() => {
        this.users = this.users.filter((user) => user.id !== id);
        this.notiService.showSuccess('Delete successfully!');
      });
    });
  }

  showDetailsModal(id: number): void {
    this.userService.fetchById(id).subscribe((user) => {
      this.userModalService.showDetailModel(user);
    });
  }

  showUpdateModal(id: number): void {
    this.userService.fetchById(id).subscribe((user) => {
      this.userModalService.showUpdateModal(user);
    });
  }
}
