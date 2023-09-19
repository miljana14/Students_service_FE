import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserLoginDataService } from '../services/user-login-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRolesGuard implements CanActivate {

  constructor(private userLoginData: UserLoginDataService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const roles: string[] = route.data['roles'] as string[];
      const roleExists = this.userLoginData.userLoginData?.authorities.some(authority => roles.some(role => role === authority.authority));
      if(!this.userLoginData.isUserLogged || !roleExists){
        return this.router.parseUrl('/login');
      }

    return true;
  }

}
