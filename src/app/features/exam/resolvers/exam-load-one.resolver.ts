import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Exam } from 'src/app/core/models';
import { HttpExamService } from 'src/app/core/services/http-exam.service';

@Injectable({
  providedIn: 'root'
})
export class ExamLoadOneResolver implements Resolve<Exam> {
  constructor(private httpExam: HttpExamService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Exam> {
    const id = Number(route.paramMap.get('id'));
    return this.httpExam.getById(id);
  }
}
