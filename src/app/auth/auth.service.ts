import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import {tap, take, exhaustMap, startWith} from 'rxjs/operators';
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
export class dueUserModel {
    constructor(
        public roll: string,
        public name: string,
        public hostel: string,
        public room: number
    ){}
}

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    url = 'https://nitc-mess.herokuapp.com/';
    isAdmin: boolean;
    username: string;
    mess: string;
    constructor(private http: HttpClient,private router: Router, @Inject(SESSION_STORAGE) private storage: WebStorageService) {}

    login(email: string, password: string) {
        return this.http.post<loginResponse>(this.url + 'api/auth/signin',
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

    //List Subscribers

    listu(){
        return this.user.pipe(take(1), exhaustMap(user => {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+ user.token
                })
            };
            return this.http.get(
                this.url + 'api/dues/list',httpOptions
            );
        }));
    }
    updatedues(rollno:string,due: number, date: number){
        return this.user.pipe(take(1), exhaustMap(user => {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+ user.token
                })
            };
            return this.http.post(this.url + 'api/dues/add',
            {
                "rollNumber": rollno,
                "message": "Juice", 
                "date": date, 
                "amount": due
            },httpOptions);
        }));
    }

    //List Unregistered

    listunreg(){
        return this.user.pipe(take(1), exhaustMap(user => {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+ user.token
                })
            };
            return this.http.get(
                this.url + 'api/admin/list-people-without-mess',httpOptions
            );
        }));
    }
    addmess(rollno:string,mess:string){
        return this.user.pipe(take(1), exhaustMap(user => {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+ user.token
                })
            };
            return this.http.post(this.url + 'api/admin/assign-mess',
            {
                "rollNumber": rollno,
                "mess": mess
            },httpOptions);
        }));
    }


    //Admin Dues List
    dueUser = new BehaviorSubject<dueUserModel>(null);
    changedueUser(user: dueUserModel){
        this.dueUser.next(user);
    }
    getDues(){
        return this.user.pipe(take(1), exhaustMap(user => {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+ user.token
                })
            };
            return this.http.post(this.url + 'api/admin/student/dues',
            {
                "rollNumber": this.dueUser.value.roll
            },httpOptions);
        }));
    }

    //messCut
    messcut(start: number, end: number, roll: string){
        return this.user.pipe(take(1), exhaustMap(user => {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+ user.token
                })
            };
            return this.http.post(this.url + 'api/dues/messcut',
            {
                "rollNumber": roll,
                "start": start,
                "end": end
            },httpOptions);
        }));
    }

}