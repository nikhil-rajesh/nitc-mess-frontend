import { Component, OnInit } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { AuthService, dueUserModel } from '../auth/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

declare interface dues {
  date: string,
  dailycharge: number,
  extra: number,
}
declare interface dueListRes {
  _id: string,
  rollNumber: string,
  amount: number,
  message: string,
  date: number
}
export interface listuser {
  email: string;
  rollNumber: string;
  total: number;
  hostel: string;
  room: number;
}

@Component({
  selector: 'app-mess-cut',
  templateUrl: './mess-cut.component.html',
  styleUrls: ['./mess-cut.component.css']
})

export class MessCutComponent implements OnInit {

  user: dueUserModel = new dueUserModel('','','',0);
  extra: number;
  total: number;
  totalexpr: string = "";
  users: listuser[] = [];
  filteredUsers: Observable<listuser[]>;

  selected =  {startDate: moment(), endDate: moment()};
  constructor(private authService: AuthService) { 
    this.authService.listu().subscribe(
      resData => {
        this.users = <listuser[]>resData;
        console.log(resData);
      },
      error => {
        console.log(error);
      }
    );
  }

  studentDetails: FormGroup = new FormGroup({
    roll: new FormControl(this.user.roll),
    name: new FormControl(this.user.name),
    hostel: new FormControl(this.user.hostel),
    room: new FormControl(this.user.room),
    extra: new FormControl(this.extra),
    total: new FormControl(this.totalexpr),
  })
  duesList: dues[] = new Array;
  displayedColumns: string[] = ['id', 'date', 'dailyCharge', 'extra'];
  dataSource = new MatTableDataSource(this.duesList);

  makeDueList(){
    this.authService.getDues().subscribe(
      resData => {
        let temp = <dueListRes[]>resData;
        let dates = temp.reduce((acc,item) => {
          let d = new Date(item.date);
          let date = moment((d.getMonth()+1) + '-' + d.getDate()+ '-' + d.getFullYear(),'l').format("DD-MM-YYYY");
          if(!acc.includes(date))
            return acc.concat([date]);
          return acc;
        },[])
        this.duesList = dates.map(item => {
          let temp2 = {
            date: item,
            dailycharge: 0,
            extra: 0
          }
          let a = temp.reduce((acc,item2)=>{
            let d = new Date(item2.date);
            let dd = moment((d.getMonth()+1) + '-' + d.getDate()+ '-' + d.getFullYear(),'l').format("DD-MM-YYYY");
            if(dd === item){
              if(item2.message === "DailyCharge")
                acc[0] += item2.amount;
              else 
                acc[1] += item2.amount;
            }
            return acc;
          },[0,0]);
          temp2.dailycharge = a[0];
          temp2.extra = a[1];
          return temp2;
        });
        this.extra = this.duesList.reduce((acc,item) => acc+item.extra,0);
        this.total = this.duesList.reduce((acc,item) => acc+item.extra+item.dailycharge,0);
        this.totalexpr = this.total-this.extra + '+' + this.extra + '=' + this.total;
        this.studentDetails.patchValue({
          roll: this.user.roll,
          name: this.user.name,
          hostel: this.user.hostel,
          room: this.user.room,
          extra: this.extra,
          total: this.totalexpr,
        });
        this.dataSource = new MatTableDataSource(this.duesList);
        console.log(this.duesList);
      },
      error => {
        console.log(error);
      }
    )
  }

  refreshData(roll: string){
    let tempuser = this.users.filter(user => user.rollNumber === roll);
    this.user.hostel = tempuser[0].hostel;
    this.user.name = tempuser[0].email;
    this.user.roll = tempuser[0].rollNumber;
    this.user.room = tempuser[0].room;
    this.authService.dueUser.next(this.user);
    this.makeDueList();
  }
  
  private _filterusers(value: string): listuser[] {
    const filterValue = value.toLowerCase();

    return this.users.filter(option => option.rollNumber.toLowerCase().includes(filterValue));
  }

  ngOnInit() {
    if(this.authService.dueUser.value !== null){
      this.authService.dueUser.subscribe(user => this.user = user);
      this.makeDueList();
    }

    this.filteredUsers = this.studentDetails.get('roll')!.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterusers(value))
    );
  }

}
