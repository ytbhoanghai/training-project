import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/auth/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit(): void {}
}
