import { NotificationService } from './../../../layouts/notification/notification.service';
import { IStore } from 'src/app/manager/store-management/store.service';
import { Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-store-form',
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.css'],
})
export class StoreFormComponent implements OnInit {
  @Input("store") store: IStore;
  @Output() onSubmit = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  storeForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.email]],
    address: [''],
    phone: [
      '',
      [
        Validators.pattern(/(09|01)([0-9]{8,})\b/),
        Validators.maxLength(11),
      ],
    ],
    status: ['']
  });

  constructor(private formBuilder: FormBuilder, private notiService: NotificationService) {}

  ngOnInit(): void {
    this.fillDataToForm();
  }

  emitSubmitEvent(): void {
    console.log(this.storeForm.value)
    if (this.storeForm.valid) {
      return this.onSubmit.emit(this.storeForm.value);
    }
    this.notiService.showWaring('Invalid form. Please check again!');
  }

  fillDataToForm(): void {
    if (!this.store) return;
    this.storeForm.patchValue(this.store)
  }
}
