import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { tap, map } from 'rxjs/operators';
import { AuthActionTypes, LogIn, LogInSuccess, LogInFailure, LogOut } from '../actions/auth.actions';

import { AuthService } from '../../services/auth.service';


@Injectable()
export class AuthEffects {

    constructor(private actions: Actions, private authService: AuthService, private router: Router) { }

    @Effect()
    LogIn: Observable<any> = this.actions
        .ofType(AuthActionTypes.LOGIN)
        .map((action: LogIn) => action.payload)
        .switchMap(payload => {
            return this.authService.loginEmail(payload).then(res => {
                return new LogInSuccess({ email: res.user.email });
            }, err => {
                return Observable.of(new LogInFailure({ err: err }));
            })
        });

    @Effect({ dispatch: false })
    LogInSuccess: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.LOGIN_SUCCESS),
        tap((user) => {
            localStorage.setItem('email', user.payload.token);
            this.router.navigate(['/home']);
        })
    );

    @Effect({ dispatch: false })
    LogInFailure: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.LOGIN_FAILURE
        ));

    @Effect({ dispatch: false })
    LogOut: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.LOGOUT),
        tap((user) => {
            this.authService.logoutEmail().then(res => {
                localStorage.removeItem('email');
                this.router.navigate(['']);
            }, err => {
                alert('Something happens.');
            })
            
        })
    ); 

}