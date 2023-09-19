import { Injectable } from '@angular/core';
import { UserLoginData } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserLoginDataService {
  private _userLoginData?: UserLoginData;

  constructor() {
    const userData = this.storage.getItem('userData');
    if (userData) {
      this._userLoginData = JSON.parse(userData);
    }
  }

  get userLoginData() : UserLoginData | undefined {
    return this._userLoginData;
  }

  set userLoginData(userLoginData: UserLoginData | undefined) {
    this._userLoginData = userLoginData;
    this.storage.setItem('userData', JSON.stringify(userLoginData));
  }

  get storage() {
    return localStorage;
  }

  set token(token: string | null) {
    if (token) {
      this.storage.setItem('token',token);
    } else {
      this.storage.removeItem('token');
    }
  }

  get token() {
    return this.storage.getItem('token');
  }

  get isUserLogged(){
    return !!this._userLoginData;
  }

  logout(){
    this.storage.removeItem('token');
    this.storage.removeItem('userData');
    this._userLoginData = undefined;

    if ('caches' in window) {
      caches.keys().then(function(names) {
        names.forEach(function(name) {
          caches.delete(name);
        });
      });
    }
  }

  updateUser(newUser: UserLoginData) {
    if (this._userLoginData) {
      this._userLoginData = newUser;
      this.storage.setItem('userData', JSON.stringify(this._userLoginData));
    }
  }
}
