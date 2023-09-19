import { ExaminationPeriod, PageDto, PageRequest } from './../models';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpExaminationPeriodService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<ExaminationPeriod[]> {

    return this.httpClient.get<ExaminationPeriod[]>(`${environment.serverUrl}/examination_period`);
  }

  getAllPresentOrFuture(): Observable<ExaminationPeriod[]> {

    return this.httpClient.get<ExaminationPeriod[]>(`${environment.serverUrl}/examination_period/presentOrFuture`);
  }

  getByPage(pageRequest: PageRequest){

    const params = new HttpParams()
    .set('pageNo', pageRequest.pageNo-1)
    .set('pageSize', pageRequest.pageSize)
    .set('sortBy', pageRequest.sortBy)
    .set('sortOrder', pageRequest.sortOrder)
    return this.httpClient.get<PageDto<ExaminationPeriod>>(`${environment.serverUrl}/examination_period/filter`, {params});

  }

  saveExaminationPeriod(examinationPeriod: ExaminationPeriod): Observable<ExaminationPeriod>{
    return this.httpClient.post<ExaminationPeriod>(`${environment.serverUrl}/examination_period`,examinationPeriod);
  }

  updateExaminationPeriod(id: number, examinationPeriod: ExaminationPeriod): Observable<ExaminationPeriod>{
    return this.httpClient.patch<ExaminationPeriod>(`${environment.serverUrl}/examination_period/${id}`,examinationPeriod);
  }

  getByName(name: string){
    return this.httpClient.get<ExaminationPeriod>(`${environment.serverUrl}/examination_period/name/${name}`);
  }

  getById(id: number){
    return this.httpClient.get<ExaminationPeriod>(`${environment.serverUrl}/examination_period/${id}`);
  }

  deleteExaminationPeriod(ep: ExaminationPeriod){
    return this.httpClient.delete<string>(`${environment.serverUrl}/examination_period/${ep.id}`, {responseType: 'text' as 'json'});
  }

  examinationPeriodByClone(name: string, beginDate: Date, cloneName: string): Observable<ExaminationPeriod>{
    const params = new HttpParams()
    .set('name', name)
    .set('beginDate', beginDate.toString())
    .set('cloneName', cloneName);
    return this.httpClient.post<ExaminationPeriod>(`${environment.serverUrl}/examination_period/examinationPeriodByClone`, {}, { params });
  }

  searchExaminationPeriods(pageRequest: PageRequest, keyword?: string, name?: boolean, beginDate?: boolean, endDate?: boolean, active?: boolean) {
    const params = new HttpParams()
      .set('pageNo', pageRequest.pageNo - 1)
      .set('pageSize', pageRequest.pageSize)
      .set('sortBy', pageRequest.sortBy)
      .set('sortOrder', pageRequest.sortOrder)
      .set('keyword', keyword || '')
      .set('name', name === undefined ? 'false' : String(name))
      .set('beginDate', beginDate === undefined ? 'false' : String(beginDate))
      .set('endDate', endDate === undefined ? 'false' : String(endDate))
      .set('active', active === undefined ? 'false' : String(active));
    
    return this.httpClient.get<PageDto<ExaminationPeriod>>(`${environment.serverUrl}/examination_period/search`, { params });
  }

}
