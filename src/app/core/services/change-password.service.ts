import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangePassword, UserLoginData } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private httpClient: HttpClient) { }


  changePassword(userlogin: {password: string, repeatedPassword: string}): Observable<ChangePassword> {

    const queryParams = `?password=${encodeURIComponent(userlogin.password)}&repeatedPassword=${encodeURIComponent(userlogin.repeatedPassword)}`;

    const params = new HttpParams();
    params.set("password", userlogin.password);
    params.set("repeatedPassword", userlogin.repeatedPassword);

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    const body = null; 
    
    return this.httpClient.patch<ChangePassword>('http://localhost:8080/user/change-password'+ queryParams, body,{headers} );

  }

  changeProfessorPassword(userlogin: {password: string, repeatedPassword: string}): Observable<ChangePassword> {

    const params = new URLSearchParams();
    params.set("password", userlogin.password);
    params.set("repeatedPassword", userlogin.repeatedPassword);

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    return this.httpClient.post<ChangePassword>('http://localhost:8080/user/change-professor-password', params, { headers,});

  }
}
