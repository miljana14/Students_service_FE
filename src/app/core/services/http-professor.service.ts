
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageDto, PageRequest, Professor, Subject } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HttpProfessorService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Professor[]> {

    return this.httpClient.get<Professor[]>(`${environment.serverUrl}/professors`);
  }

  getByPage(pageRequest: PageRequest){

    const params = new HttpParams()
    .set('pageNo', pageRequest.pageNo-1)
    .set('pageSize', pageRequest.pageSize)
    .set('sortBy', pageRequest.sortBy)
    .set('sortOrder', pageRequest.sortOrder)
    return this.httpClient.get<PageDto<Professor>>(`${environment.serverUrl}/professors/filter`, {params});

  }

  deleteProfessor(professor: Professor){
    return this.httpClient.delete<string>(`${environment.serverUrl}/professors/${professor.id}`, {responseType: 'text' as 'json'});
  }

  saveProfessor(professor: Professor): Observable<Professor>{
    return this.httpClient.post<Professor>(`${environment.serverUrl}/professors`,professor);
  }

  editProfessor(id: number, professor: Professor): Observable<Professor>{
    return this.httpClient.patch<Professor>(`${environment.serverUrl}/professors/${id}`,professor);
  }

  getById(id: number): Observable<Professor>{
    return this.httpClient.get<Professor>(`${environment.serverUrl}/professors/${id}`);
  }

  search(keyword: string): Observable<Professor[]> {
    const params: HttpParams = new HttpParams().set('keyword', keyword)
    return this.httpClient.get<Professor[]>(`${environment.serverUrl}/professors/search`, { params });
  }

  addSubjectsToProfessor(professorId: number, subjects: Subject[]): Observable<any>{
    return this.httpClient.post<any>(`${environment.serverUrl}/professors/subjects/${professorId}`, subjects,{responseType: 'text' as 'json'});
  }

  availableProfessors(subjectId: number){
    return this.httpClient.get<Professor[]>(`${environment.serverUrl}/professors/availableProfessors/${subjectId}`);
  }

  searchProfessors(pageRequest: PageRequest, keyword?: string, firstName?: boolean, lastName?: boolean, email?: boolean, address?: boolean, postalCode?: boolean, phone?: boolean, reelectionDate?: boolean, title?: boolean) {
    const params = new HttpParams()
      .set('pageNo', pageRequest.pageNo - 1)
      .set('pageSize', pageRequest.pageSize)
      .set('sortBy', pageRequest.sortBy)
      .set('sortOrder', pageRequest.sortOrder)
      .set('keyword', keyword || '')
      .set('firstName', firstName === undefined ? 'false' : String(firstName))
      .set('lastName', lastName === undefined ? 'false' : String(lastName))
      .set('email', email === undefined ? 'false' : String(email))
      .set('address', address === undefined ? 'false' : String(address))
      .set('postalCode', postalCode === undefined ? 'false' : String(postalCode))
      .set('phone', phone === undefined ? 'false' : String(phone))
      .set('reelectionDate', reelectionDate === undefined ? 'false' : String(reelectionDate))
      .set('title', title === undefined ? 'false' : String(title));
    
    return this.httpClient.get<PageDto<Professor>>(`${environment.serverUrl}/professors/search`, { params });
  }
}


