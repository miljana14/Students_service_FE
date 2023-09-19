import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageDto, PageRequest, Subject } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HttpSubjectService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Subject[]> {

    return this.httpClient.get<Subject[]>(`${environment.serverUrl}/subjects`);
  }

  getAllP(id: number): Observable<Subject[]> {

    return this.httpClient.get<Subject[]>(`${environment.serverUrl}/subjects/professor/${id}`);
  }

  getAllSubjectsProfessorDontHave(id: number): Observable<Subject[]> {
    return this.httpClient.get<Subject[]>(`${environment.serverUrl}/subjects/professorDontHave/${id}`);
  }

  removeSubjectFromProfessor(professorId: number, subjectId: number){
    return this.httpClient.delete<string>(`${environment.serverUrl}/subjects/${professorId}/subjects/${subjectId}`, {responseType: 'text' as 'json'});
  }


  getByPage(pageRequest: PageRequest){

    const params = new HttpParams()
    .set('pageNo', pageRequest.pageNo-1)
    .set('pageSize', pageRequest.pageSize)
    .set('sortBy', pageRequest.sortBy)
    .set('sortOrder', pageRequest.sortOrder)
    return this.httpClient.get<PageDto<Subject>>(`${environment.serverUrl}/subjects/filter`, {params});

  }

  deleteSubject(subject: Subject){
    return this.httpClient.delete<string>(`${environment.serverUrl}/subjects/${subject.id}`, {responseType: 'text' as 'json'});
  }

  saveSubject(subject: Subject): Observable<any>{
    return this.httpClient.post<any>(`${environment.serverUrl}/subjects`,subject);
  }

  editSubject(id: number, subject: Subject): Observable<any>{
    return this.httpClient.patch<any>(`${environment.serverUrl}/subjects/${id}`,subject);
  }

  getById(id: number){
    return this.httpClient.get<Subject>(`${environment.serverUrl}/subjects/${id}`);
  }

  search(keyword: string): Observable<Subject[]> {
    const params: HttpParams = new HttpParams().set('keyword', keyword)
    return this.httpClient.get<Subject[]>(`${environment.serverUrl}/subjects/search`, { params });
  }

  getStudentsSubjects(indexNumber: string, indexYear: number): Observable<any>{
    return this.httpClient.get<any>(`${environment.serverUrl}/subjects/student/${indexNumber}/${indexYear}`);
  }

  searchSubjects(pageRequest: PageRequest, keyword?: string, name?: boolean, description?: boolean, semester?: boolean, noOfESP?: boolean, yearOfStudy?: boolean){
    const params = new HttpParams()
      .set('pageNo', pageRequest.pageNo - 1)
      .set('pageSize', pageRequest.pageSize)
      .set('sortBy', pageRequest.sortBy)
      .set('sortOrder', pageRequest.sortOrder)
      .set('keyword', keyword || '')
      .set('name', name === undefined ? 'false' : String(name))
      .set('description', description === undefined ? 'false' : String(description))
      .set('semester', semester === undefined ? 'false' : String(semester))
      .set('noOfESP', noOfESP === undefined ? 'false' : String(noOfESP))
      .set('yearOfStudy', yearOfStudy === undefined ? 'false' : String(yearOfStudy));

    return this.httpClient.get<PageDto<Subject>>(`${environment.serverUrl}/subjects/search`, { params });
  }
}