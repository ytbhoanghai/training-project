import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {IUser} from "../../../core/auth/user.service";
import {IStore, StoreService} from "../../store-management/store.service";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @Input("user") user: IUser;
  @Output() onSubmit = new EventEmitter();
  stores: IStore[] = [];

  userForm = this.formBuilder.group({
    // id: [],
    name: ['', Validators.min(4)],
    username: ['', [Validators.required, Validators.min(4)]],
    password: ['', [Validators.required, Validators.min(4)]],
    email: ['', Validators.email],
    address: [],
    storeId: null
  })

  constructor(
    private formBuilder: FormBuilder,
    private storeService: StoreService) {
  }

  ngOnInit(): void {
    this.fetchStores();
    this.fillUserToForm();
  }

  fetchStores(): void {
    this.storeService.fetchStores().subscribe(stores => {
      console.log(this.stores);
      this.stores = stores;
    })
  }

  fillUserToForm(): void {
    if (!this.user) return;
    this.userForm.patchValue({...this.user})
  }

}
