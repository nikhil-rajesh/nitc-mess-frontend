import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ListsubscribersService } from './list-subscribers.service';
import { NgForm } from '@angular/forms';

export interface listuser {
  email: string;
  rollNumber: string;
  total: number;
}

@Component({
  selector: 'app-list-subscribers',
  templateUrl: './list-subscribers.component.html',
  styleUrls: ['./list-subscribers.component.css']
})
export class ListSubscribersComponent implements OnInit {

  users: listuser[];
  temp: string;
  loaded = false;
  displayedColumns: string[] = ['id','email','rollno','total','adddue'];
  dataSource = new MatTableDataSource(this.users);
  constructor(private listsubscribersservice: ListsubscribersService) {
    this.makelist();
  }

  makelist(){
    this.listsubscribersservice.listu().subscribe(
      resData => {
        this.users = <listuser[]>resData;
        this.loaded = true;
        this.dataSource = new MatTableDataSource(this.users);
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
  onAddDues(rollno: string,due: number){
    this.listsubscribersservice.updatedues(rollno,due).subscribe(
      resData => {
      },
      error => {
      }
    );
    this.makelist();
  }
  ngOnInit() {
  }

}
