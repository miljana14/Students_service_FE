import { Student } from './../models/student.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Exam, PageDto, PageRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HttpStudentService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Student[]> {

    return this.httpClient.get<Student[]>(`${environment.serverUrl}/students`);
  }

  getByPage(pageRequest: PageRequest){

    const params = new HttpParams()
    .set('pageNo', pageRequest.pageNo-1)
    .set('pageSize', pageRequest.pageSize)
    .set('sortBy', pageRequest.sortBy)
    .set('sortOrder', pageRequest.sortOrder)
    return this.httpClient.get<PageDto<Student>>(`${environment.serverUrl}/students/filter`, {params});

  }

  deleteStudent(student: Student){
    return this.httpClient.delete<string>(`${environment.serverUrl}/students/${student.indexNumber}/${student.indexYear}`, {responseType: 'text' as 'json'});
  }

  saveStudent(student: Student): Observable<Student>{
    return this.httpClient.post<Student>(`${environment.serverUrl}/students`,student);
  }

  editStudent(indexNumber: string, indexYear: number, student: Student): Observable<Student>{
    return this.httpClient.patch<Student>(`${environment.serverUrl}/students/${indexNumber}/${indexYear}`,student);
  }

  getById(indexNumber: string, indexYear: number){
    return this.httpClient.get<Student>(`${environment.serverUrl}/students/${indexNumber}/${indexYear}`);
  }

  search(keyword: string): Observable<Student[]> {
    const params: HttpParams = new HttpParams().set('keyword', keyword)
    return this.httpClient.get<Student[]>(`${environment.serverUrl}/students/search`, { params });
  }

 studentsForExam(examId: number): Observable<Student[]>{
    return this.httpClient.get<Student[]>(`${environment.serverUrl}/students/studentsForExam/${examId}`);
  }

  subjectsForStudent(pageRequest: PageRequest, subjectId: number){
    const params = new HttpParams()
    .set('pageNo', pageRequest.pageNo - 1)
    .set('pageSize', pageRequest.pageSize)
    .set('sortBy', pageRequest.sortBy)
    .set('sortOrder', pageRequest.sortOrder)
    return this.httpClient.get<PageDto<Student>>(`${environment.serverUrl}/students/subject/${subjectId}`, { params });
  }

  searchStudents(pageRequest: PageRequest, keyword?: string, indexNumber?: boolean, indexYear?: boolean, firstName?: boolean, lastName?: boolean, email?: boolean, address?: boolean, postalCode?: boolean, currentYearOfStudy?: boolean) {
    const params = new HttpParams()
      .set('pageNo', pageRequest.pageNo - 1)
      .set('pageSize', pageRequest.pageSize)
      .set('sortBy', pageRequest.sortBy)
      .set('sortOrder', pageRequest.sortOrder)
      .set('keyword', keyword || '')
      .set('indexNumber', indexNumber === undefined ? 'false' : String(indexNumber))
      .set('indexYear', indexYear === undefined ? 'false' : String(indexYear))
      .set('firstName', firstName === undefined ? 'false' : String(firstName))
      .set('lastName', lastName === undefined ? 'false' : String(lastName))
      .set('email', email === undefined ? 'false' : String(email))
      .set('address', address === undefined ? 'false' : String(address))
      .set('postalCode', postalCode === undefined ? 'false' : String(postalCode))
      .set('currentYearOfStudy', currentYearOfStudy === undefined ? 'false' : String(currentYearOfStudy));

    return this.httpClient.get<PageDto<Student>>(`${environment.serverUrl}/students/search`, { params });
}

searchStudentsBySubject(subjectId: number,pageRequest: PageRequest, keyword?: string, indexNumber?: boolean, indexYear?: boolean, firstName?: boolean, lastName?: boolean, currentYearOfStudy?: boolean) {
  const params = new HttpParams()
    .set('subjectId', subjectId)
    .set('pageNo', pageRequest.pageNo - 1)
    .set('pageSize', pageRequest.pageSize)
    .set('sortBy', pageRequest.sortBy)
    .set('sortOrder', pageRequest.sortOrder)
    .set('keyword', keyword || '')
    .set('indexNumber', indexNumber === undefined ? 'false' : String(indexNumber))
    .set('indexYear', indexYear === undefined ? 'false' : String(indexYear))
    .set('firstName', firstName === undefined ? 'false' : String(firstName))
    .set('lastName', lastName === undefined ? 'false' : String(lastName))
    .set('currentYearOfStudy', currentYearOfStudy === undefined ? 'false' : String(currentYearOfStudy));

  return this.httpClient.get<PageDto<Student>>(`${environment.serverUrl}/students/searchBySubject`, { params });
}


}
