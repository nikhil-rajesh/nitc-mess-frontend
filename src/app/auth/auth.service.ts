import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import {tap} from 'rxjs/operators';
import * as jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { User } from './useradmin.model';
import { BehaviorSubject } from 'rxjs';
import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';

interface user {
    role: string;
    _id: string;
    name: string;
    email: string;
    rollNumber: string;
    createdAt: Date;
    updatedAt: Date;
    mess: string;
}
interface loginResponse {
    user: user;
    token: string;
}
@Injectable({providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    isAdmin: boolean;
    username: string;
    mess: string;
    constructor(private http: HttpClient,private router: Router, @Inject(SESSION_STORAGE) private storage: WebStorageService) {}

    login(email: string, password: string) {
        return this.http.post<loginResponse>('http://nitc-mess.anandu.net/api/auth/signin',
            {
                email: email,
                password: password
            })
            .pipe(tap(resData => {
                const user = new User(resData.token, resData.user.role.includes("admin"));
                this.isAdmin = resData.user.role.includes('admin');
                this.username = resData.user.name;
                this.mess = resData.user.mess;
                this.storage.set('mess',this.mess);
                this.storage.set('username',this.username);
                this.storage.set('isAdmin',this.isAdmin);
                this.storage.set('token',resData.token);
                this.user.next(user);
            }));
    }
    
    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
    }
    
    get admin() {
        return this.isAdmin;
    }
}