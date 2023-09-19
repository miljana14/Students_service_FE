import { ExaminationPeriod } from './../../../core/models';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpExaminationPeriodService } from 'src/app/core/services/http-examination-period.service';

@Injectable({
  providedIn: 'root'
})
export class ExaminationPeriodLoadOneResolver implements Resolve<ExaminationPeriod> {
  constructor(private httpExaminationPeriod: HttpExaminationPeriodService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ExaminationPeriod> {
    const id = Number(route.paramMap.get('id'));
    return this.httpExaminationPeriod.getById(id);

  }
}
