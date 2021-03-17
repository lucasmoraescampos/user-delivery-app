import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpResult } from '../models/http-result.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private url: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public getAll() {
    return this.http.get<HttpResult>(`${this.url}/user/location`);
  }

  public create(data: any) {
    return this.http.post<HttpResult>(`${this.url}/user/location`, data);
  }

  public update(id: number, data: any) {
    return this.http.put<HttpResult>(`${this.url}/user/location/${id}`, data);
  }

  public delete(id: number) {
    return this.http.delete<HttpResult>(`${this.url}/user/location/${id}`);
  }
  
}
