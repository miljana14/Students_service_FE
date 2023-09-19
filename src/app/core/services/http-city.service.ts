import { City } from './../models/city.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpCityService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<City[]> {

    return this.httpClient.get<City[]>(`${environment.serverUrl}/cities`);
  }
}
