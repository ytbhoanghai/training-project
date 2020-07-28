import { MDBModalService, MDBModalRef } from 'ng-uikit-pro-standard';
import { NotificationService } from 'src/app/layouts/notification/notification.service';
import { RoleManagementService } from './../../service/role-management.service';
import { IRole } from './../../manager/role-management/role-management.component';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-role-update-modal',
  templateUrl: './role-update-modal.component.html',
  styleUrls: ['./role-update-modal.component.css'],
})
export class RoleUpdateModalComponent implements OnInit {
  @Input() roleModalRef: MDBModalRef;
  role: IRole;

  constructor(
    private roleService: RoleManagementService,
    private notiSerive: NotificationService,
    private modalService: MDBModalService
  ) {}

  ngOnInit(): void {
  }

  handleSubmit(roleId: number, body): void {
    console.log(roleId, body);
    this.roleService.updateRole(roleId, body).subscribe((role) => {
      this.notiSerive.showSuccess('Updated successfully!');
      this.hide();
    });
  }

  hide(): void {
    this.modalService.hide(1);
  }
}
