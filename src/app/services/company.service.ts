import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigHelper } from '../helpers/config.helper';
import { HttpResult } from '../models/http-result.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) { }

  public getBySlug(slug: string) {
    return this.http.get<HttpResult>(`${this.url}/company/${slug}`);
  }
  
}
