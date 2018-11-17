import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  private uUser: User = new User();
  private rRole: Role = new Role();
  private bLoading: boolean = true;

  //Edit User Form
  private uEditUser: User = new User();
  private bLoadtingEditUser: boolean = false;

  //New User Form
  private newUser: User = new User();
  private passwordTemp: any;
  private bLoadtingNewUser: boolean = false;

  //For both Forms
  private sErrorMessage: string = '';
  private sSuccessMessage: string = '';
  private bLoadingRoles: boolean = true;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.getUsers().subscribe((res: any) => {
      this.uUser = res;
      this.bLoading = false;
    });

  }

  ngOnInit() {

  }

  logout() {
    this.authService.logoutEmail().then(res => {
      this.router.navigate(['']);
    }, err => {
      alert('Something happens.');
    });
  }

  deleteUser(keyToDelete: any) {
    if (window.confirm('Are sure you want to delete this user ?')) {
      this.authService.deleteItem('user', keyToDelete).then(() => {
        alert('Deleted.');
      }, err => {
        alert('Error while deleting the user.');
      });
    }
  }

  //EDIT USER
  editUser(user: any) {
    this.uEditUser = Object.assign({}, user);
  }

  onEditUserDialogHide() {
    this.sSuccessMessage = '';
    this.sErrorMessage = '';
  }

  onEditUserDialogShow() {
    this.authService.getRole().subscribe((res: any) => {
      this.rRole = res;
      this.bLoadingRoles = false;
    });

  }

  addNewRoleForEditUser(sRoleToAdd: string, selected: any) {
    //Verify if already exist the role for that user.
    let exist = this.uEditUser.role.indexOf(sRoleToAdd) > 0 ? true : false;

    //If not exist and the event is 'add'.
    if (selected && !exist) {
      this.uEditUser.role.push(sRoleToAdd);
    } else {
      this.uEditUser.role.splice(this.uEditUser.role.indexOf(sRoleToAdd), 1);
    }
  }

  saveEditUser() {
    this.sSuccessMessage = '';
    this.sErrorMessage = '';
    let regexEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    let sEmailValid = regexEmail.test(String(this.uEditUser.email).toLowerCase());
    if (sEmailValid && this.uEditUser.name != '') {
      this.bLoadtingEditUser = true;
      this.authService.updateItem('user', this.uEditUser, this.uEditUser.id).then(() => {
        this.bLoadtingEditUser = false;
        this.sSuccessMessage = 'User edited with success.'
      }, err => {
        this.bLoadtingEditUser = false;
      });

    } else {
      this.sErrorMessage = 'Some fiedls are incorrect or missed!';
    }
  }

  //NEW USER
  onNewUserDialogHide() {
    this.newUser = new User();
    this.passwordTemp = null;
    this.sSuccessMessage = '';
    this.sErrorMessage = '';
  }

  onNewUserDialogShow() {
    this.authService.getRole().subscribe((res: any) => {
      this.rRole = res;
      this.bLoadingRoles = false;
    });
  }


  addNewRoleForNewUser(sRoleToAdd: string, selected: any) {
    //Verify if already exist that user.
    let exist = this.newUser.role.indexOf(sRoleToAdd) > 0 ? true : false;

    //If not exist and the event is 'add'.
    if (selected && !exist) {
      this.newUser.role.push(sRoleToAdd);
    } else {
      this.newUser.role.splice(this.newUser.role.indexOf(sRoleToAdd), 1);
    }
  }

  saveNewUser() {
    this.sSuccessMessage = '';
    this.sErrorMessage = '';
    let regexEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    let regexPassword = /^.{6,}$/;

    let sEmailValid = regexEmail.test(String(this.newUser.email).toLowerCase());
    let sPassValid = regexPassword.test(this.passwordTemp);
    if (sEmailValid && sPassValid && this.newUser.name != '') {
      this.bLoadtingNewUser = true;
      this.authService.registerNewUser(this.newUser.email, this.passwordTemp).then(res => {
        this.authService.createItem('user', this.newUser).then((item) => {
          //Update the user ID to the key that was returned after the user's creation.
          this.authService.updateItem('user', { id: item.key }, item.key).then(() => {
            this.bLoadtingNewUser = false;
            this.sSuccessMessage = 'User created with success.'
          }, err => {
            this.authService.deleteItem('user', item.key).then(() => {
              this.bLoadtingNewUser = false;
              this.sErrorMessage = 'User NOT created.'
            });
          });
        }, err => {
          this.bLoadtingNewUser = false;
          this.sErrorMessage = err.message;
        });
      }, err => {
        this.bLoadtingNewUser = false;
        this.sErrorMessage = err.message;
      })

    } else {
      this.sErrorMessage = 'Some fiedls are incorrect or missed!';
    }
  }
}
