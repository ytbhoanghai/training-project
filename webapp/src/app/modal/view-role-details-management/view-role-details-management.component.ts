import { Component, OnInit } from '@angular/core';
import { IRole } from "../../manager/role-management/role-management.component";

@Component({
  selector: 'app-view-role-details-management',
  templateUrl: './view-role-details-management.component.html',
  styleUrls: ['./view-role-details-management.component.css']
})
export class ViewRoleDetailsManagementComponent implements OnInit {

  role: IRole;

  constructor() { }

  ngOnInit(): void {
  }

}
