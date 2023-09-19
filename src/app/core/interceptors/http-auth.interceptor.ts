import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLoginDataService } from '../services/user-login-data.service';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {

  constructor(private userLoginData: UserLoginDataService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = this.userLoginData.token;

    if (token) {
      request  = request.clone(
        {headers: request.headers.set('Authorization', token)}
      )
    }

    return next.handle(request);
  }
}
