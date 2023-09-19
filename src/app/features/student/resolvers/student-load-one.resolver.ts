import { HttpStudentService } from './../../../core/services/http-student.service';
import { Student } from 'src/app/core/models';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentLoadOneResolver implements Resolve<Student> {

  constructor(private httpStudent: HttpStudentService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Student> {
    const indexNumber = route.paramMap.get('indexNumber');
    const indexYear = Number(route.paramMap.get('indexYear'));
    return this.httpStudent.getById(indexNumber!,indexYear);
  }
}
