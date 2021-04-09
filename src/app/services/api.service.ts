import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResult } from 'src/app/models/http-result.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public getCategories() {
    return this.http.get<HttpResult>(`${this.url}/categories`);
  }
  
  public getCompaniesByAllCategories(latitude: number, longitude: number) {
    let query = `?latitude=${latitude}&longitude=${longitude}`;
    return this.http.get<HttpResult>(`${this.url}/companies-by-all-categories${query}`);
  }

  public getCompaniesByCategory(latitude: number, longitude: number, category_id: number, limit?: number, offset?: number) {
    let query = `?latitude=${latitude}&longitude=${longitude}&category_id=${category_id}`;
    if (limit) {
      query += `&limit=${limit}`;
    }
    if (offset) {
      query += `&offset=${offset}`;
    }
    return this.http.get<HttpResult>(`${this.url}/companies-by-category${query}`);
  }

  public checkDuplicity(data: any) {
    return this.http.post<HttpResult>(`${this.url}/check-duplicity`, data);
  }

  public sendVerificationCode(data: any) {
    return this.http.post<HttpResult>(`${this.url}/send-code-verification`, data);
  }

  public confirmVerificationCode(data: any) {
    return this.http.post<HttpResult>(`${this.url}/confirm-code-verification`, data);
  }
}
