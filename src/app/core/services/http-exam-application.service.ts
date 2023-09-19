import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PageRequest, PageDto, Exam } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpExamApplicationService {

  constructor(private httpClient: HttpClient) { }

  getByPage(pageRequest: PageRequest){

    const params = new HttpParams()
    .set('pageNo', pageRequest.pageNo-1)
    .set('pageSize', pageRequest.pageSize)
    .set('sortBy', pageRequest.sortBy)
    .set('sortOrder', pageRequest.sortOrder)
    return this.httpClient.get<PageDto<Exam>>(`${environment.serverUrl}/exam_application/filter`, {params});

  }

  search(keyword: string): Observable<Exam[]> {
    const params: HttpParams = new HttpParams().set('keyword', keyword)
    return this.httpClient.get<Exam[]>(`${environment.serverUrl}/exam_application/search`, { params });
  }

  enrollExams(exams: Exam[]){
      return this.httpClient.post<Exam[]>(`${environment.serverUrl}/exam_application`,exams);
    }
}
