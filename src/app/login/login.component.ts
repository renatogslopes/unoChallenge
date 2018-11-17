import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  fgLoginForm: FormGroup;
  private sErrorMessage: string = '';
  private bFlagLoading: boolean = false;

  constructor(private form: FormBuilder, private router: Router, private authService: AuthService) {
    this.createForm();
   }

  ngOnInit() {
    
  }

  createForm() {
    this.fgLoginForm = this.form.group({
      email: ['', Validators.required ],
      password: ['',Validators.required]
    });
  }

  login(value){
    this.bFlagLoading = true;
    this.authService.loginEmail(value).then(res => {
      this.bFlagLoading = false;
      this.router.navigate(['/home']);
    }, err => {
      this.bFlagLoading = false;
      this.sErrorMessage = err.message;
    })
  }
}
