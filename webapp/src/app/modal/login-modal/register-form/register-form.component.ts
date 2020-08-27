import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/core/auth/user.service';
import { Router } from '@angular/router';
import { NotificationService } from './../../../layouts/notification/notification.service';
import { ICustomerBody } from './../../../service/customer.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
})
export class RegisterFormComponent implements OnInit {
  registerForm = this.formBuilder.group(
    {
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      repassword: ['', [Validators.required, Validators.minLength(4)]],
    },
    {
      validators: this.checkMatchedPass,
    }
  );

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private notiService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  handleSubmit(): void {
    console.log(this.registerForm.value);
    const body: ICustomerBody = this.registerForm.value;
    this.userService.createAccount(body).subscribe(() => {
      this.notiService.showSuccess('Account created!');
      this.router.navigate(['']);
      this.registerForm.reset();
    }, (err: HttpErrorResponse) => {
      if (err.status === 500) {
        this.notiService.showError('Existed username');
      }
    });
  }

  checkMatchedPass(form: FormGroup): Record<string, unknown> {
    const pass = form.get('password').value;
    const repass = form.get('repassword').value;
    return pass === repass ? null : { notMatched: true };
  }
}
