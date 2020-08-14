import { Router, ActivatedRoute } from '@angular/router';
import { IStore } from 'src/app/manager/store-management/store.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/auth/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css'],
})
export class ShoppingComponent implements OnInit {
  stores: IStore[] = [];
  listener: Subscription;

  searchKeyword: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadSearchQuery();
  }

  loadSearchQuery(): void {
    this.searchKeyword = this.route.snapshot.queryParams.search;
  }

  isLogin(): boolean {
    return this.userService.isLogin();
  }

  handleSearch(): void {
    this.router.navigate([location.pathname], {
      queryParams: { search: this.searchKeyword },
      queryParamsHandling: 'merge',
    });
  }

  handleInput(): void {
    if (!this.searchKeyword) {
      this.handleSearch();
    }
  }
}
