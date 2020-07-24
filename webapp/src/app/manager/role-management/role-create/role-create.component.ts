import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {IPermission, IPermissionChoose, IResource} from "../role-management.component";
import {RoleManagementService} from "../../../service/role-management.service";

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.css']
})
export class RoleCreateComponent implements OnInit {

  resources: IResource[];

  constructor(private location: Location, private roleManagementService: RoleManagementService) { }

  ngOnInit(): void {
    this.findAllResources();
  }

  back(): void {
    this.location.back();
  }

  findAllResources(): void {
    this.roleManagementService
      .findAllResources()
      .subscribe(resources => this.resources = resources);
  }

  onChangeButtonCheckAllPermissions(resourceName: string): void {
    let resource: IResource = this.getResourceByName(resourceName);
    this.checkAllPermissions(resource.permissions, resource.isCheckAllPermissions);
  }

  onChangeButtonCheckPermission(permission: IPermissionChoose, resource: IResource): void {
    if (permission.type === "UPDATE" && permission.choose) {
      (resource.permissions[1] as IPermissionChoose).choose = true;
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
    resource.permissions.forEach(permission => {
      if ((permission as IPermissionChoose).choose) {
        temp += 1;
      }
    })
    return temp === 4;
  }

  checkAllPermissions(permissions: IPermission[], checked: boolean): void {
    permissions.forEach(permission => (permission as IPermissionChoose).choose = checked);
  }

  removeAllChecked(): void {
    this.resources.forEach(resource => {
      resource.isCheckAllPermissions = false;
      this.checkAllPermissions(resource.permissions, false);
    })
  }
}


