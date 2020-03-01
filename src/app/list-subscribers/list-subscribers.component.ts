import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort, MatTableDataSource, MatSuffix } from '@angular/material';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { AuthService, dueUserModel } from '../auth/auth.service';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface listuser {
  email: string;
  rollNumber: string;
  total: number;
  hostel: string;
  room: number;
}

@Component({
  selector: 'app-list-subscribers',
  templateUrl: './list-subscribers.component.html',
  styleUrls: ['./list-subscribers.component.css'],
  encapsulation : ViewEncapsulation.None,
})
export class ListSubscribersComponent implements OnInit {

  users: listuser[];
  temp: string;
  loaded = false;
  displayedColumns: string[] = ['id','email','rollno', 'hostel', 'room', 'total','adddue'];
  dataSource = new MatTableDataSource(this.users);
  constructor(private authService: AuthService) {
    this.makelist();
  }

  date: FormGroup = new FormGroup({
    'date': new FormControl(new Date())
  });

  makelist(){
    this.authService.listu().subscribe(
      resData => {
        this.users = <listuser[]>resData;
        this.loaded = true;
        this.dataSource = new MatTableDataSource(this.users);
        console.log(resData);
      },
      error => {
        console.log(error);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  AddDueForm: FormGroup = new FormGroup({
    due: new FormControl()
  })
  onAddDues(rollno: string){
    console.log(this.AddDueForm.value.due);
    this.authService.updatedues(rollno,this.AddDueForm.value.due,(this.date.value.date).getTime()).subscribe(
      resData => {
        console.log(resData);
      },
      error => {
        console.log(error);
      }
    );
    this.AddDueForm.reset();
    this.makelist();
  }

  onSelectStudent(element: listuser){
    let a = new dueUserModel(element.rollNumber, element.email, element.hostel, element.room);
    this.authService.changedueUser(a);
  }
  ngOnInit() {
  }

}
