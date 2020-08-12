import { IRole } from './../../role-management/role-management.component';
import { RoleManagementService } from './../../../service/role-management.service';
import { NotificationService } from './../../../layouts/notification/notification.service';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IUser } from '../../../core/auth/user.service';
import { IStore, StoreService } from '../../store-management/store.service';

export enum FormType {
  CREATE,
  UPDATE,
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  @Input('user') user: IUser;
  @Input('type') type: FormType;
  @Output() onSubmit = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  stores: IStore[] = [];
  roles: IRole[] = [];
  isPasswordMatched = true;

  userForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: [null, [Validators.minLength(4)]],
    repassword: [null, [Validators.minLength(4)]],
    email: ['', Validators.email],
    address: [],
    roleIds: [[]],
    storeId: [null],
  });

  constructor(
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private roleService: RoleManagementService,
    private notiService: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchStores();
    this.fetchRoles();
    this.fillUserToForm();
  }

  fetchStores(): void {
    this.storeService.fetchStores().subscribe((stores) => {
      this.stores = stores;
    });
  }

  fetchRoles(): void {
    this.roleService.findAllRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  fillUserToForm(): void {
    if (!this.user) return;
    this.userForm.patchValue({
      ...this.user,
      roleIds: this.user.roles.map((r) => r.id),
      storeId: this.user.idStore
    });
  }

  emitSubmitEvent(): void {
    if (this.userForm.valid) {
      return this.onSubmit.emit(this.userForm.value);
    }
    this.notiService.showWaring('Invalid form. Please check again!');
  }

  validatePass(): void {
    const pass = this.userForm.get('password').value;
    const repass = this.userForm.get('repassword').value;
    const isMatched = pass === repass;
    // Set invalid form if password not matched
    if (!isMatched) {
      this.userForm.setErrors({ isMatched: false });
    }
    this.isPasswordMatched = isMatched;
  }

  isUpdateMode(): boolean {
    return this.type === FormType.UPDATE;
  }
}
