import { NotificationService } from 'src/app/layouts/notification/notification.service';
import { RoleUpdateModalComponent } from './../../modal/role-update-modal/role-update-modal.component';
import { Component, OnInit } from '@angular/core';
import { RoleManagementService } from "../../service/role-management.service";
import {MDBModalRef, MDBModalService} from "ng-uikit-pro-standard";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import {ViewRoleDetailsManagementComponent} from "../../modal/view-role-details-management/view-role-details-management.component";
import {ConfirmModalComponent} from "../../modal/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit {

  roles: IRole[];
  confirmModalRef: MDBModalRef;

  constructor(
    private roleManagementService: RoleManagementService,
    private modalService: MDBModalService,
    private ngbService: NgbModal,
    private notiSerive: NotificationService) { }

  ngOnInit(): void {
    this.roleManagementService.findAllRoles()
      .subscribe(roles => this.roles = roles);
  }

  viewRoleDetails(role: IRole): void {
    this.roleManagementService.findRoleById(role.id)
      .subscribe(role => {
        this.modalService.show(ViewRoleDetailsManagementComponent, {
          containerClass: 'fade',
          class: 'modal-dialog-centered modal-xl',
          data: { role } });
      })
  }

  openUpdateModal(role: IRole): void {
    this.roleManagementService.findRoleById(role.id).subscribe(role => {
      this.modalService.show(RoleUpdateModalComponent, {
            class: 'modal-xl',
            data: { role }
      });
    })
  }

  deleteRole(role: IRole): void {
    this.confirmModalRef = this.modalService.show(ConfirmModalComponent, {
      containerClass: 'modal fade top',
      class: 'modal-dialog modal-frame modal-top',
      data: {
        key: 'DeleteAction'
      }
    });
    this.confirmModalRef.content.action.subscribe(({value, key}) => {
      if (key === "DeleteAction" && value === ConfirmModalComponent.YES) {
        this.roleManagementService.deleteRoleById(role.id).subscribe(_ => {

          // delete role in view
          let index = this.roles.indexOf(role);
          this.roles.splice(index, 1);
          document.getElementById(`role-${role.id}`).remove();

          // hide modal confirm
          this.confirmModalRef.hide();
          this.notiSerive.showSuccess('Role deleted successfully!');
        })
      }
    })
  }

  openModal(modalName): void {
    this.ngbService.open(modalName);
  }
}

export interface IResource {
  name: string;
  permissions: IPermission[] | IPermissionChoose[];
  isCheckAllPermissions: boolean;
}

export interface IRole {
  id: number;
  name: string;
  createdBy: number;
  permissions: IPermission[];
}

export interface IRoleBody {
  name: string,
  permissions: number[]
}

export interface IPermission {
  id: number;
  name: string;
  resourceName: string;
  type: string;
  choose?: boolean;
}

export interface IPermissionChoose extends IPermission {
  choose: boolean;
}
