import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Title } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HttpTitleService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Title[]> {

    return this.httpClient.get<Title[]>(`${environment.serverUrl}/titles`);
  }
}
