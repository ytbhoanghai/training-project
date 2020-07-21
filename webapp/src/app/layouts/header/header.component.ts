import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from 'src/app/core/auth/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.fetchUserInfor().subscribe();
  }

  login(): void {
    this.authService.loginUser('admin', 'admin').subscribe((res) => {
      console.log('res', res);
    });
  }

  logout(): void {
    this.authService.logoutUser().subscribe();
  }
}
