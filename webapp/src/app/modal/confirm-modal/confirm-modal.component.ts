import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {MDBModalRef} from "ng-uikit-pro-standard";

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

  public static YES: boolean = true;
  public static NO: boolean = false;

  action: Subject<any> = new Subject();
  key: string;

  constructor(private modalRef: MDBModalRef) { }

  ngOnInit(): void {
  }

  onButtonYesClick(): void {
    this.action.next({value: ConfirmModalComponent.YES, key: this.key});
  }

  onButtonNoClick(): void {
    this.action.next({value: ConfirmModalComponent.NO, key: this.key});
    this.modalRef.hide();
  }
}
