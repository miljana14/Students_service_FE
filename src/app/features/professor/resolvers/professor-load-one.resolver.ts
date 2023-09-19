import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Professor } from 'src/app/core/models/professor.model';
import { HttpProfessorService } from 'src/app/core/services/http-professor.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessorLoadOneResolver implements Resolve<Professor> {

  constructor(private httpProfessor: HttpProfessorService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Professor> {
    const id = Number(route.paramMap.get('id'));
    return this.httpProfessor.getById(id);
  }
}
