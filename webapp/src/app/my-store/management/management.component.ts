import { UserService, IGrantedPermisson } from 'src/app/core/auth/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  StoreService,
  StatusType,
} from './../../manager/store-management/store.service';
import { IStore } from 'src/app/manager/store-management/store.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css'],
})
export class ManagementComponent implements OnInit {
  store: IStore; storeId: number;
  grantedPermissions: IGrantedPermisson;

  constructor(
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchCurrentStore();
    this.checkPermissionOnResources();
  }

  fetchCurrentStore(): void {
    this.route.params.subscribe((params) => {
      this.storeId = params.id;
      this.storeService.fetchById(this.storeId).subscribe((store) => {
        this.store = store;
      });
    });
  }

  checkPermissionOnResources(): void {
    // const body: Record<string, string[]> = {};
    this.userService.checkPermissionOnResources().subscribe((res) => {
      this.grantedPermissions = res;

      // Redirect if URL end with number
      const regex = /\d+$/;
      if (!regex.test(location.pathname)) return;

      if (this.canShow('product')) {
        return this.router.navigate(['products'], { relativeTo: this.route });
      }
      if (this.canShow('category')) {
        return this.router.navigate(['categories'], { relativeTo: this.route });
      }
      if (this.canShow('staff')) {
        return this.router.navigate(['staffs'], { relativeTo: this.route });
      }
      if (this.canShow('role')) {
        return this.router.navigate(['roles'], { relativeTo: this.route });
      }
    });
  }

  canShow(role: string): boolean {
    if (!this.grantedPermissions) return false;
    return !!this.grantedPermissions[role]?.includes('read');
  }

  isClosed(): boolean {
    return this.store?.status.toString() == StatusType[StatusType.Closed];
  }
}
