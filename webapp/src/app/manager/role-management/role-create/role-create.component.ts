import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  IPermission,
  IPermissionChoose,
  IResource,
  IRoleBody,
} from '../role-management.component';
import { RoleManagementService } from '../../../service/role-management.service';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.css'],
})
export class RoleCreateComponent implements OnInit {
  resources: IResource[];
  roleName: string = '';

  constructor(
    private location: Location,
    private roleManagementService: RoleManagementService,
  ) {}

  ngOnInit(): void {
    this.findAllResources();
  }

  back(): void {
    this.location.back();
  }

  findAllResources(): void {
    this.roleManagementService
      .findAllResources()
      .subscribe((resources) => (this.resources = resources));
  }

  onChangeButtonCheckAllPermissions(resourceName: string): void {
    let resource: IResource = this.getResourceByName(resourceName);
    this.checkAllPermissions(
      resource.permissions,
      resource.isCheckAllPermissions
    );
  }

  onChangeButtonCheckPermission(
    permission: IPermissionChoose,
    resource: IResource
  ): void {
    switch (permission.type) {
      case 'UPDATE':
        if (permission.choose) {
          (resource.permissions[1] as IPermissionChoose).choose = true;
        }
        break;
      case 'READ':
        if (!permission.choose) {
          (resource.permissions[2] as IPermissionChoose).choose = false;
        }
    }

    resource.isCheckAllPermissions = this.isCheckAllPermissions(resource);
  }

  getResourceByName(name: string): IResource {
    for (let i = 0; i < this.resources.length; i++) {
      if (this.resources[i].name === name) {
        return this.resources[i];
      }
    }
    return null;
  }

  isCheckAllPermissions(resource: IResource): boolean {
    let temp = 0;
    resource.permissions.forEach((permission) => {
      if ((permission as IPermissionChoose).choose) {
        temp += 1;
      }
    });
    return temp === 4;
  }

  checkAllPermissions(permissions: IPermission[], checked: boolean): void {
    permissions.forEach(
      (permission) => ((permission as IPermissionChoose).choose = checked)
    );
  }

  removeAllChecked(): void {
    this.resources.forEach((resource) => {
      resource.isCheckAllPermissions = false;
      this.checkAllPermissions(resource.permissions, false);
    });
  }

  submitForm(): void {
    const body: IRoleBody = {
      name: this.roleName,
      permissions: this.getPermissionsFromResource(this.resources)
    }
    this.roleManagementService.createRole(body).subscribe(role => {
      console.log("Inserted role", role);
      this.back();
    })
  }

  getPermissionsFromResource(resources: IResource[]): number[] {
    let selectedRoles: number[] = [];
    // Check if permission is selected then return ID
    this.resources.forEach((resource) => {
      resource.permissions.forEach((permission) => {
        if ((permission as IPermissionChoose).choose) {
          selectedRoles.push(permission.id);
        }
      });
    });
    return selectedRoles;
  }
}
