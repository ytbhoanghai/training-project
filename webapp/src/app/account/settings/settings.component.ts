import { AuthService } from 'src/app/core/auth/auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from './../../layouts/notification/notification.service';
import { UserService, IUser } from './../../core/auth/user.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  user: IUser;

  accountForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    address: [''],
    username: ['', [Validators.required, Validators.minLength(4)]],
  });

  passwordForm = this.formBuilder.group({
    oldPass: ['', [Validators.required, Validators.minLength(4)]],
    newPass: ['', [Validators.required, Validators.minLength(4)]],
    rePass: ['', [Validators.required, Validators.minLength(4)]],
  }, {
    validators: this.checkPassword
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private notiService: NotificationService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.user = this.userService.getCurrentUser();
    console.log('user', this.userService.getCurrentUser());
    this.fillAccountForm();
  }

  fillAccountForm(): void {
    this.accountForm.patchValue({ ...this.user });
  }

  handleUpdateAccount(): void {
    console.log(this.accountForm.value);
    this.userService.updateAccount(this.accountForm.value).subscribe((user) => {
      console.log(user);
      this.notiService.showSuccess('Update account successfully!');
      this.userService.updateCurrentUser(user);
      this.router.navigate(['']);
    });
  }

  handleUpdatePassword(): void {
    if (this.passwordForm.invalid) {
      this.notiService.showQuickWarning('Invalid form');
      return;
    }
    this.userService.updatePassword(this.passwordForm.value).subscribe(
      (res) => {
        console.log(res);
        this.notiService.showSuccess('Update password successfully!');
        this.authService.logoutUser().subscribe();
      },
      (err) => console.log(err)
    );
  }

  back(): void {
    this.location.back();
  }

  checkPassword(form: FormGroup): Record<string, unknown> {
    const newPass = form.get('newPass').value;
    const rePass = form.get('rePass').value;
    return newPass === rePass ? null : { notMatched: true };
  }
}
