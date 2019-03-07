import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from'@angular/router';
import { AuthService } from'./auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {
  
  constructor(private aS: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): any | boolean {
    if (this.aS.authenticated()) return true;
    // TODO ...
    return false;
  }
}
