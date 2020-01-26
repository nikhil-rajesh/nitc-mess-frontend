import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ListUnregisteredService } from './list-unregistered.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

export interface listuser {
  email: string;
  rollNumber: string;
  total: number;
}

@Component({
  selector: 'app-list-unregistered',
  templateUrl: './list-unregistered.component.html',
  styleUrls: ['./list-unregistered.component.css']
})
export class ListUnregisteredComponent implements OnInit {

  users: listuser[];
  temp: string;
  loaded = false;
  displayedColumns: string[] = ['id','email','rollno','adddue'];
  dataSource = new MatTableDataSource(this.users);
  constructor(private listunregisteredservice: ListUnregisteredService, private authService: AuthService) {
    this.makelist();
  }

  makelist(){
    this.listunregisteredservice.listunreg().subscribe(
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
  onAddMess(rollno: string){
    console.log(rollno);
    this.listunregisteredservice.addmess(rollno,this.authService.mess).subscribe(
      resData => {
        console.log(resData);
        console.log(this.authService.mess);
      },
      error => {
      }
    );
    this.makelist();
  }
  ngOnInit() {
  }

}
