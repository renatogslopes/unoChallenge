import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Role } from '../models/role.model';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  private rRole: Role = new Role();
  private bLoading: boolean = true;

  //Edit Role Form
  private rEditRole: Role = new Role();
  private bLoadtingEditRole: boolean = false;

  //New Role Form
  private rNewRole: Role = new Role();
  private bLoadtingNewRole: boolean = false;

  //For both Forms
  private sErrorMessage: string = '';
  private sSuccessMessage: string = '';
  private bLoadingRoles: boolean = true;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.getRole().subscribe((res: any) => {
      this.rRole = res;
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

  deleteRole(keyToDelete: any) {
    if (window.confirm('Are sure you want to delete this role ?')) {
      this.authService.deleteItem('role', keyToDelete).then(() => {
        alert('Deleted.');
      }, err => {
        alert('Error while deleting the role.');
      });
    }
  }

  //EDIT ROLE
  editRole(role: any) {
    this.rEditRole = Object.assign({}, role);
  }

  onEditRoleDialogHide() {
    this.sSuccessMessage = '';
    this.sErrorMessage = '';
  }

  saveEditRole() {
    this.sSuccessMessage = '';
    this.sErrorMessage = '';

    if (this.rEditRole.name != '') {
      this.bLoadtingEditRole = true;
      this.authService.updateItem('role', this.rEditRole, this.rEditRole.id).then(() => {
        this.bLoadtingEditRole = false;
        this.sSuccessMessage = 'Role edited with success.'
      }, err => {
        this.bLoadtingEditRole = false;
      });

    } else {
      this.sErrorMessage = 'Some fiedls are incorrect or missed!';
    }
  }

  //NEW ROLE
  onNewRoleDialogHide() {
    this.rNewRole = new Role();

    this.sSuccessMessage = '';
    this.sErrorMessage = '';
  }

  saveNewRole() {
    this.sSuccessMessage = '';
    this.sErrorMessage = '';

    if (this.rNewRole.name != '') {
      this.bLoadtingNewRole = true;
      this.authService.createItem('role', this.rNewRole).then((item) => {
        //Update the role ID to the key that was returned after the role's creation.
        this.authService.updateItem('role', { id: item.key }, item.key).then(() => {
          this.bLoadtingNewRole = false;
          this.sSuccessMessage = 'Role created with success.'
        }, err => {
          this.authService.deleteItem('role', item.key).then(() => {
            this.bLoadtingNewRole = false;
            this.sErrorMessage = 'Role NOT created.'
          });
        });
      }, err => {
        this.bLoadtingNewRole = false;
        this.sErrorMessage = err.message;
      });

    } else {
      this.sErrorMessage = 'Some fiedls are incorrect or missed!';
    }
  }

}
