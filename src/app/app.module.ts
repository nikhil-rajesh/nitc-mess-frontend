import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HttpClientModule } from '@angular/common/http';
import { Routes,RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard2, AuthGuard, AuthGuardAdmin } from './auth/auth.guard';
import { HeaderComponent } from './header/header.component';
import { ListSubscribersComponent } from './list-subscribers/list-subscribers.component';
import { ListUnregisteredComponent } from './list-unregistered/list-unregistered.component';
import { StorageServiceModule } from 'angular-webstorage-service';


const appRoutes: Routes = [
  { path: '', component: AuthComponent, canActivate: [AuthGuard2]},
  { path: 'auth', component: AuthComponent, canActivate: [AuthGuard2]},
  { path: 'list', component: ListSubscribersComponent, canActivate: [AuthGuard,AuthGuardAdmin] },
  { path: 'unreg', component: ListUnregisteredComponent, canActivate: [AuthGuard,AuthGuardAdmin] }
];

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    ListSubscribersComponent,
    ListUnregisteredComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    MatTableModule,
    MatSortModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    StorageServiceModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
