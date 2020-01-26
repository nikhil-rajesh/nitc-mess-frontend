import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { take, exhaustMap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class ListUnregisteredService {
    constructor(private http: HttpClient,private authService: AuthService){}

    listunreg(){
        return this.authService.user.pipe(take(1), exhaustMap(user => {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+ user.token
                })
            };
            return this.http.get(
                'http://nitc-mess.anandu.net/api/admin/list-people-without-mess',httpOptions
            );
        }));
    }
    addmess(rollno:string,mess:string){
        return this.authService.user.pipe(take(1), exhaustMap(user => {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+ user.token
                })
            };
            return this.http.post('http://nitc-mess.anandu.net/api/admin/assign-mess',
            {
                "rollNumber": rollno,
                "mess": mess
            },httpOptions);
        }));
    }
}