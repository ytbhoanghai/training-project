import { Component, OnInit } from '@angular/core';
import { ISimpleStaff } from 'src/app/manager/store-management/store.service';
import {UserManagementService} from "../../../manager/user-management/user-management.service";

@Component({
  selector: 'app-store-staffs',
  templateUrl: './store-staffs.component.html',
  styleUrls: ['./store-staffs.component.css']
})
export class StoreStaffsComponent implements OnInit {
  staffs: ISimpleStaff[] = [];
  addedStaffs: ISimpleStaff[] = [];

  selectStaffId: number;

  constructor(private staffService: UserManagementService) { }

  ngOnInit(): void {
    this.fetchStaffs();
  }

  fetchStaffs(): void {
    this.staffService.fetchAll().subscribe(staffs  => {
      // @ts-ignore
      this.staffs = staffs;
      this.resetSelected();
    })
  }

  addStaff(): void {
    const staff: ISimpleStaff = this.staffs.find(s => s.id === this.selectStaffId);
    if (!staff) return;
    console.log(staff);

    this.addedStaffs.push(staff);
    this.staffs = this.staffs.filter(s => s.id !== this.selectStaffId);
    this.resetSelected();
  }

  removeStaff(staff: ISimpleStaff): void {
    this.staffs.push(staff);
    this.addedStaffs = this.addedStaffs.filter(s => s !== staff);
  }

  resetSelected(): void {
    this.selectStaffId = this.staffs[0]?.id;
  }
}
