import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        router: RouterStateSnapshot
    ): boolean | Promise<boolean> | Observable<boolean> {
        return this.authService.user.pipe(map(user => {
            if(!user)
                this.router.navigate(['/auth']);
            return !!user;
        }));
    }
}

@Injectable({ providedIn: 'root' })
export class AuthGuard2 implements CanActivate {
    constructor(private authService: AuthService) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        router: RouterStateSnapshot
    ): boolean | Promise<boolean> | Observable<boolean> {
        return this.authService.user.pipe(map(user => {
            return !user;
        }));
    }
}

@Injectable({ providedIn: 'root' })
export class AuthGuardAdmin implements CanActivate {
    constructor(private authService: AuthService,private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        router: RouterStateSnapshot
    ): boolean | Promise<boolean> | Observable<boolean> {
        return this.authService.user.pipe(map(user => {
            if(!user.isAdmin)
                this.router.navigate(['/auth']);
            return user.isAdmin;
        }));
    }
}