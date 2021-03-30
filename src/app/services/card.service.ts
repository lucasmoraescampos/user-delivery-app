import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpResult } from '../models/http-result.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private url: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public getAll() {
    return this.http.get<HttpResult>(`${this.url}/user/card`);
  }

  public getById(id: number) {
    return this.http.get<HttpResult>(`${this.url}/user/card/${id}`);
  }

  public create(data: any) {
    return this.http.post<HttpResult>(`${this.url}/user/card`, data);
  }

}
