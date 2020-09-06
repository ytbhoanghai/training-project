import { Component, OnInit } from '@angular/core';
import { UserModalService } from '../../service/user-modal.service';
import { IUser } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-user-details-modal',
  templateUrl: './user-details-modal.component.html',
  styleUrls: ['./user-details-modal.component.css'],
})
export class UserDetailsModalComponent implements OnInit {
  user: IUser;

  constructor(private userModalService: UserModalService) {}

  ngOnInit(): void {}

  hideModal(): void {
    this.userModalService.userDetailsModalRef.hide();
  }

  getRolesFormUser(user: IUser): string {
    return user.roles.map(r => r.name).join(', ');
  }
}
