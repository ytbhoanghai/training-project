import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoleDetailsManagementComponent } from './view-role-details-management.component';

describe('ViewRoleDetailsManagementComponent', () => {
  let component: ViewRoleDetailsManagementComponent;
  let fixture: ComponentFixture<ViewRoleDetailsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRoleDetailsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRoleDetailsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
