import { NotificationService } from './../../../layouts/notification/notification.service';
import { ConfirmModalService } from './../../../service/confirm-modal.service';
import { RoleModalService } from './../../../service/role-modal.service';
import { IRole } from './../../../manager/role-management/role-management.component';
import { RoleManagementService } from './../../../service/role-management.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-roles',
  templateUrl: './store-roles.component.html',
  styleUrls: ['./store-roles.component.css'],
})
export class StoreRolesComponent implements OnInit {
  roles: IRole[] = [];

  constructor(
    private roleService: RoleManagementService,
    private roleModalService: RoleModalService,
    private confirmService: ConfirmModalService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchRoles();
    this.roleService.roleAddObservable$.subscribe((role) => {
      if (role) {
        this.roles.push(role);
      }
    });
  }

  fetchRoles(): void {
    this.roleService.findAllRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  newRole(): void {
    this.roleModalService.showAddModal();
  }

  showUpdateModal(role: IRole): void {
    this.roleService.findRoleById(role.id).subscribe((role) => {
      this.roleModalService.showUpdateModal(role);
    });
  }

  deleteRole(id: number): void {
    this.confirmService.show().onYes(() => {
      this.roleService.deleteRoleById(id).subscribe(
        () => {
          this.roles = this.roles.filter((r) => r.id !== id);
        },
        () => this.notiService.showError()
      );
    });
  }
}
