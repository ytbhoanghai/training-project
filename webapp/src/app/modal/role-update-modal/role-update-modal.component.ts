import { IRole } from './../../manager/role-management/role-management.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  moduleId: 'resoure-table',
  selector: 'app-role-update-modal',
  templateUrl: './role-update-modal.component.html',
  styleUrls: ['./role-update-modal.component.css']
})
export class RoleUpdateModalComponent implements OnInit {
  role: IRole;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    console.log('this.role', this.role)
  }

}
