import { Router } from '@angular/router';
import { NotificationService } from './../../../layouts/notification/notification.service';
import {
  ICustomerBody,
  CustomerService,
} from './../../../service/customer.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
})
export class RegisterFormComponent implements OnInit {
  registerForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    address: [''],
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    repassword: ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private notiService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  handleSubmit(): void {
    console.log(this.registerForm.value);
    const body: ICustomerBody = this.registerForm.value;
    this.customerService.createCustomer(body).subscribe(() => {
      this.notiService.showSuccess('Account created!');
      this.router.navigate(['']);
    });
  }
}
