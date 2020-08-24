import { NotificationService } from './../../layouts/notification/notification.service';
import { RoleManagementService } from './../../service/role-management.service';
import { RoleModalService } from './../../service/role-modal.service';
import { Component, OnInit } from '@angular/core';
import { IRoleBody } from 'src/app/manager/role-management/role-management.component';

@Component({
  selector: 'app-role-add-modal',
  templateUrl: './role-add-modal.component.html',
  styleUrls: ['./role-add-modal.component.css'],
})
export class RoleAddModalComponent implements OnInit {
  constructor(
    private roleModalService: RoleModalService,
    private roleService: RoleManagementService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {}

  hideModal(): void {
    this.roleModalService.hideAddModal();
  }

  handleSubmit(body: IRoleBody): void {
    this.roleService.createRole(body).subscribe((role) => {
      this.roleService.roleAddSubject.next(role);
      this.notiService.showSuccess('Role created successfully!');
      this.hideModal();
    });
  }
}
