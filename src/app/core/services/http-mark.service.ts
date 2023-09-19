import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Mark } from '../models/mark.model';

@Injectable({
  providedIn: 'root'
})
export class HttpMarkService {

  constructor(private httpClient: HttpClient) { }

  addMark(examId: number, index: string, mark: number): Observable<any> {
    let params = new HttpParams()
    .set('examId', examId)
    .set('index', index)
    .set('mark', mark);
    return this.httpClient.post<any>(`${environment.serverUrl}/marks`, {}, { params });
  }

  getAllByStudent(){
    return this.httpClient.get<Mark[]>(`${environment.serverUrl}/marks/students`);
  }

  getAll(){
    return this.httpClient.get<Mark[]>(`${environment.serverUrl}/marks`);
  }


}
