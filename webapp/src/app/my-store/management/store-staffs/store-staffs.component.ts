import { Subscription } from 'rxjs';
import { UserService, IUser } from './../../../core/auth/user.service';
import { ConfirmModalService } from './../../../service/confirm-modal.service';
import { UserModalService } from './../../../service/user-modal.service';
import { NotificationService } from '../../../layouts/notification/notification.service';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../../manager/store-management/store.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISimpleStaff } from 'src/app/manager/store-management/store.service';
import { UserManagementService } from '../../../manager/user-management/user-management.service';

@Component({
  selector: 'app-store-staffs',
  templateUrl: './store-staffs.component.html',
  styleUrls: ['./store-staffs.component.css'],
})
export class StoreStaffsComponent implements OnInit, OnDestroy {
  staffs: ISimpleStaff[] = [];
  addedStaffs: ISimpleStaff[] = [];

  storeId: number;
  selectStaffId = 0;

  listeners = new Subscription();

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

    this.listeners.add(
      this.staffService.userAddObservable$.subscribe((user) => {
        if (user) {
          this.addedStaffs.push(user);
        }
      })
    );

    this.listeners.add(
      this.staffService.updateObservable$.subscribe((user: IUser) => {
        console.log('Listen', user);
        const index = this.addedStaffs.findIndex((u) => u.id === user.id);
        this.addedStaffs[index] = { ...this.addedStaffs[index], ...user };
      })
    );
  }

  ngOnDestroy(): void {
    this.listeners.unsubscribe();
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

  editStaff(staff: ISimpleStaff): void {
    this.staffService.fetchById(staff.id).subscribe((user) => {
      console.log(user);
      user.idStore = this.storeId;
      this.userModalService.showUpdateModal(user);
    });
  }

  deleteStaff(staff: ISimpleStaff): void {
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
