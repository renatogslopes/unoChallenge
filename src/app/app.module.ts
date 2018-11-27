import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MdlModule } from '@angular-mdl/core';
import { Route, RouterModule } from '@angular/router';
import { ReactiveFormsModule , FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { AuthEffects } from './store/effects/auth.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/app.states';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { NgxPaginationModule } from 'ngx-pagination';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';

const ROUTES: Route[] = [
  { path: '', component: LoginComponent},
  { path: 'home', component: HomeComponent},
  { path: 'users', component: UserComponent},
  { path: 'roles', component: RoleComponent},
  { path: '**', redirectTo: '/' }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UserComponent,
    RoleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, 
    AngularFireAuthModule, 
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    MdlModule,
    FormsModule,
    NgxPaginationModule,
    StoreModule.forRoot(reducers, {}),
    EffectsModule.forRoot([AuthEffects]),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
