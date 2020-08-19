import { ConfirmModalService } from './../../../service/confirm-modal.service';
import { UserModalService } from './../../../service/user-modal.service';
import { NotificationService } from '../../../layouts/notification/notification.service';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../../manager/store-management/store.service';
import { Component, OnInit } from '@angular/core';
import { ISimpleStaff } from 'src/app/manager/store-management/store.service';
import { UserManagementService } from '../../../manager/user-management/user-management.service';

@Component({
  selector: 'app-store-staffs',
  templateUrl: './store-staffs.component.html',
  styleUrls: ['./store-staffs.component.css'],
})
export class StoreStaffsComponent implements OnInit {
  staffs: ISimpleStaff[] = [];
  addedStaffs: ISimpleStaff[] = [];

  storeId: number;
  selectStaffId = 0;

  constructor(
    private staffService: UserManagementService,
    private storeService: StoreService,
    private notiService: NotificationService,
    private route: ActivatedRoute,
    private userModalService: UserModalService,
    private confirmService: ConfirmModalService
  ) {}

  ngOnInit(): void {
    this.storeId = this.route.parent.snapshot.params.id;
    this.fetchStaffs();
    this.staffService.userAddObservable$.subscribe((user) => {
      if (user) {
        this.addedStaffs.push(user);
      }
    });
  }

  fetchStaffs(): void {
    this.storeService
      .fetchAllStaffsInStore(this.storeId)
      .subscribe((staffs) => {
        this.addedStaffs = staffs;
      });

    this.staffService.fetchAssignableStaffs().subscribe((staffs) => {
      this.staffs = staffs;
      this.resetSelected();
    });
  }

  addStaff(): void {
    const staff: ISimpleStaff = this.staffs.find(
      (s) => s.id === this.selectStaffId
    );
    if (!staff) {
      return this.notiService.showWaring('Empty staff list');
    }

    this.storeService
      .addStaffToStore(this.storeId, this.selectStaffId)
      .subscribe(
        () => {
          this.addedStaffs.push(staff);
          this.staffs = this.staffs.filter((s) => s.id !== this.selectStaffId);
          this.notiService.showSuccess();
          this.resetSelected();
        },
        (err) => console.log(err)
      );
  }

  removeStaff(staff: ISimpleStaff): void {
    this.confirmService.show().onYes(() => {
      this.storeService.deleteStaffFromStore(this.storeId, staff.id).subscribe(
        () => {
          this.staffs.push(staff);
          this.addedStaffs = this.addedStaffs.filter((s) => s !== staff);
          this.notiService.showSuccess();
          this.resetSelected();
        },
        (err) => console.log(err)
      );
    });
  }

  resetSelected(): void {
    this.selectStaffId = this.staffs[0]?.id || 0;
  }

  newStaff(): void {
    this.userModalService.showAddModal({ storeId: +this.storeId });
  }
}
