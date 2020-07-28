import {Component, Input, OnInit} from '@angular/core';
import {IUser} from "../../core/auth/user.service";

@Component({
  selector: '[app-user-row]',
  templateUrl: './user-row.component.html',
  styleUrls: ['./user-row.component.css']
})
export class UserRowComponent implements OnInit {
  @Input() user: IUser;

  constructor() { }

  ngOnInit(): void {
  }

}
