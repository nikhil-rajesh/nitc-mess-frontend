import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { take, exhaustMap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class ListsubscribersService {
    constructor(private http: HttpClient,private authService: AuthService){}

    listu(){
        return this.authService.user.pipe(take(1), exhaustMap(user => {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+ user.token
                })
            };
            return this.http.get(
                'http://nitc-mess.anandu.net/api/admin/list-people',httpOptions
            );
        }));
    }
    updatedues(rollno:string,due: number){
        return this.authService.user.pipe(take(1), exhaustMap(user => {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+ user.token
                })
            };
            return this.http.post('http://nitc-mess.anandu.net/api/dues/add',
            {
                "rollNumber": rollno,
                "message": "Juice", 
                "amount": due
            },httpOptions);
        }));
    }
}