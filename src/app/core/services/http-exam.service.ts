import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Exam, ExaminationPeriod, PageDto, PageRequest, Subject } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HttpExamService {
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Exam[]> {

    return this.httpClient.get<Exam[]>(`${environment.serverUrl}/exams`);
  }

  getByPage(pageRequest: PageRequest){

    const params = new HttpParams()
    .set('pageNo', pageRequest.pageNo-1)
    .set('pageSize', pageRequest.pageSize)
    .set('sortBy', pageRequest.sortBy)
    .set('sortOrder', pageRequest.sortOrder)
    return this.httpClient.get<PageDto<Exam>>(`${environment.serverUrl}/exams/filter`, {params});

  }


  getByExamintionPeriod(ep: number): Observable<Exam[]>{

    return this.httpClient.get<Exam[]>(`${environment.serverUrl}/exams/filterByExaminationPeriod/${ep}`);

  }

  deleteExam(exam: Exam){
    return this.httpClient.delete<string>(`${environment.serverUrl}/exams/${exam.id}`, {responseType: 'text' as 'json'});
  }

  saveExam(exam: Exam): Observable<Exam>{
    return this.httpClient.post<Exam>(`${environment.serverUrl}/exams`,exam);
  }

  editExam(id: number, exam: Exam): Observable<Exam>{
    return this.httpClient.patch<Exam>(`${environment.serverUrl}/exams/${id}`,exam);
  }

  getById(id: number){
    return this.httpClient.get<Exam>(`${environment.serverUrl}/exams/${id}`);
  }

  search(keyword: string): Observable<Exam[]> {
    const params: HttpParams = new HttpParams().set('keyword', keyword)
    return this.httpClient.get<Exam[]>(`${environment.serverUrl}/exams/search`, { params });
  }

  availableDates(examinationPeriodId: number) {
    return this.httpClient.get<Date[]>(`${environment.serverUrl}/exams/availableDates/${examinationPeriodId}`);
  }

  availableExamsForStudent(): Observable<Exam[]>{
    return this.httpClient.get<Exam[]>(`${environment.serverUrl}/exams/forStudent`);
  }

  availableExamsForProfessor(): Observable<Exam[]>{
    return this.httpClient.get<Exam[]>(`${environment.serverUrl}/exams/forProfessor`);
  }

  applyExam(appId: number, examPeriod: number, subject: number): Observable<any>{
    return this.httpClient.post<string>(`${environment.serverUrl}/exam_application/${appId}/${examPeriod}/${subject}`, {responseType: 'text' as 'json'});
  }

  searchExams(pageRequest: PageRequest, keyword?: string, examinationPeriod?: boolean, subject?: boolean, professor?: boolean, examDate?: boolean
  ){
    const params = new HttpParams()
      .set('pageNo', pageRequest.pageNo - 1)
      .set('pageSize', pageRequest.pageSize)
      .set('sortBy', pageRequest.sortBy)
      .set('sortOrder', pageRequest.sortOrder)
      .set('keyword', keyword || '')
      .set('examinationPeriod', examinationPeriod === undefined ? 'false' : String(examinationPeriod))
      .set('subject', subject === undefined ? 'false' : String(subject))
      .set('professor', professor === undefined ? 'false' : String(professor))
      .set('examDate', examDate === undefined ? 'false' : String(examDate));
    
    return this.httpClient.get<PageDto<Exam>>(`${environment.serverUrl}/exams/search`, { params });
  }
}

