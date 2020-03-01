import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { User } from './useradmin.model';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, @Inject(SESSION_STORAGE) private storage: WebStorageService) { 
    if(!!this.storage.get('token')){
      authService.isAdmin = this.storage.get('isAdmin');
      authService.mess = this.storage.get('mess');
      authService.username = this.storage.get('username');
      const user = new User(this.storage.get('token'),this.storage.get('isAdmin'));
      authService.user.next(user);
      this.router.navigate(['/messcut']);
    }
  }
  
  message: string = null;
  errorlogin: string = null;

  onSubmitLogin(form: NgForm){
    if (!form.valid) {
      return;
    }
    const name = form.value.name;
    const password = form.value.password;
    this.authService.login(name, password).subscribe(
      resData => {
        console.log(resData);
        if(this.authService.isAdmin){
          this.router.navigate(['/list']);
        }
        else
          this.errorlogin = "Invalid User";
      },
      error => {
        this.errorlogin = error.error.errors.message;
      }

    );
    form.reset();
  }

  ngOnInit() {
  }

}
