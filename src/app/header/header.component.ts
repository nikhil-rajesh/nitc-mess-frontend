import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router, NavigationEnd, Event} from '@angular/router';
import { filter } from 'rxjs/operators';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  list:boolean = false;
  unreg:boolean = false;
  constructor(private authservice: AuthService, private router: Router, @Inject(SESSION_STORAGE) private storage: WebStorageService) { 
    this.router.events.subscribe((event:Event) => {
      if(event instanceof NavigationEnd ){
        if(event.url.includes('list'))
          this.list = true;
        if(event.url.includes('unreg'))
          this.unreg = true;
      }
    });
  }

  doLogout() {
    this.authservice.user.next(null);
    this.router.navigate(['/auth']);
    this.storage.remove('token');
  }

  isAuthenticated = false;
  isAdmin = false;
  ngOnInit() {
    this.authservice.user.subscribe(user=> {
      this.isAdmin = this.authservice.isAdmin;
    })
  }
}

