import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpResult } from '../models/http-result.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private url: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public getBySlug(slug: string) {
    return this.http.get<HttpResult>(`${this.url}/company/${slug}`);
  }
  
}
