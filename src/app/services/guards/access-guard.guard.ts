import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../users/user.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGuardGuard implements CanActivate {

  constructor(
    public _userService: UserService,
    public router: Router
  ) {}

  canActivate() {
    return this._userService.isLogged();
  }
  
}
