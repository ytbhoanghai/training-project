import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-role-update-modal',
  templateUrl: './role-update-modal.component.html',
  styleUrls: ['./role-update-modal.component.css']
})
export class RoleUpdateModalComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }



}
