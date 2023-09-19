import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpExamService } from 'src/app/core/services/http-exam.service';

@Injectable({
  providedIn: 'root'
})
export class ExamApplicationLoadOneResolver implements Resolve<number> {
  constructor(private httpExam: HttpExamService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<number> {
    const indexNumber = route.paramMap.get('indexNumber');
    const indexYear = Number(route.paramMap.get('indexYear'));
    return this.httpExam.getAppId(indexNumber!,indexYear);
  }
}
