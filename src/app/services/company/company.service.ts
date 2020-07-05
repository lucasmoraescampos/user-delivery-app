import { Injectable } from '@angular/core';
import { ConfigHelper } from '../../helpers/ConfigHelper';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpResult } from 'src/app/models/HttpResult';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) {
  }

  public getById(id: number) {
    return this.http.get<HttpResult>(`${this.url}/user/company/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getByCategory(category_id: string) {
    return this.http.get<HttpResult>(`${this.url}/user/company?category_id=${category_id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getBySubcategory(subcategory_id: string) {
    return this.http.get<HttpResult>(`${this.url}/user/company?subcategory_id=${subcategory_id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getBySearch(search: string) {
    return this.http.get<HttpResult>(`${this.url}/user/company?search=${search}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
