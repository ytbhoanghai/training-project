import { MDBModalRef } from 'ng-uikit-pro-standard';
import { ConfirmModalComponent } from './../../modal/confirm-modal/confirm-modal.component';
import { MDBModalService } from 'ng-uikit-pro-standard';
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
  confirmModalRef: MDBModalRef;

  constructor(
    private userService: UserManagementService,
    private userModalService: UserModalService,
    private modalService: MDBModalService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.userService.updateObservable$.subscribe((user: IUser) => {
      const index: number = this.users.findIndex(u => u.id === user.id);
      this.users[index] = user;
    })
  }

  fetchUsers(): void {
    this.userService.fetchAll().subscribe((users) => {
      this.users = users;
    });
  }

  deleteUser(id: number): void {
    this.confirmModalRef = this.modalService.show(ConfirmModalComponent, {
      containerClass: 'modal fade top',
      class: 'modal-dialog modal-frame modal-top',
      data: {
        key: 'DeleteStaff',
      },
    });

    this.confirmModalRef.content.action.subscribe(({ value, key }) => {
      if (key === 'DeleteStaff' && value === ConfirmModalComponent.YES) {
        this.userService.delete(id).subscribe(() => {
          this.users = this.users.filter((user) => user.id !== id);
          this.notiService.showSuccess('Delete successfully!');
        });
        this.confirmModalRef.hide();
      }
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
