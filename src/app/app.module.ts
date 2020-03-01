import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDividerModule, MatDatepickerModule, MatNativeDateModule, MatIconModule, MatAutocompleteModule } from '@angular/material';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import {MatCardModule} from '@angular/material/card';
import { MessCutComponent } from './mess-cut/mess-cut.component'; 


const appRoutes: Routes = [
  { path: '', component: AuthComponent},
  { path: 'auth', component: AuthComponent},
  { path: 'list', component: ListSubscribersComponent, canActivate: [AuthGuard,AuthGuardAdmin] },
  { path: 'unreg', component: ListUnregisteredComponent, canActivate: [AuthGuard,AuthGuardAdmin] },
  { path: 'messcut', component: MessCutComponent, canActivate: [AuthGuard,AuthGuardAdmin] }
];

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    ListSubscribersComponent,
    ListUnregisteredComponent,
    MessCutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    MatDividerModule,
    NgxDaterangepickerMd.forRoot(),
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    StorageServiceModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
