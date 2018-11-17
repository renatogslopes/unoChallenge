import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Role } from '../models/role.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {

  }

  ngOnInit() {

  }

  showUsers() {
    this.router.navigate(['/users']);
  }

  showRoles() {
    this.router.navigate(['/roles']);
  }

  logout() {
    this.authService.logoutEmail().then(res => {
      this.router.navigate(['']);
    }, err => {
      alert('Something happens.');
    });
  }

}
