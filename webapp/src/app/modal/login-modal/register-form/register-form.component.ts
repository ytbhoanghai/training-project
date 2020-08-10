import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  registerForm = this.formBuilder.group({

  })

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  handleSubmit(): void {

  }

}
