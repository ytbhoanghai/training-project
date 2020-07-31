import { Component, OnInit } from '@angular/core';
import { ISimpleStaff } from 'src/app/manager/store-management/store.service';

@Component({
  selector: 'app-store-staffs',
  templateUrl: './store-staffs.component.html',
  styleUrls: ['./store-staffs.component.css']
})
export class StoreStaffsComponent implements OnInit {
  staffs: ISimpleStaff[] = [];
  managers: ISimpleStaff[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  addManager(): void {

  }

  removeManager(): void {

  }
}
