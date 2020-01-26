import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authservice: AuthService) { }

  isAuthenticated = false;
  isAdmin = false;
  ngOnInit() {
    this.authservice.user.subscribe(user=> {
      this.isAdmin = this.authservice.isAdmin;
    })
  }

}
