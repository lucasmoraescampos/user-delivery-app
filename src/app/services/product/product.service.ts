import { Injectable } from '@angular/core';
import { ConfigHelper } from '../../helpers/ConfigHelper';
import { map } from 'rxjs/operators';
import { HttpResult } from 'src/app/models/HttpResult';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) {
  }

  public getByCompany(company_id: string) {
    return this.http.get<HttpResult>(`${this.url}/user/product?company_id=${company_id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getBySubcategory(subcategory_id: string) {
    return this.http.get<HttpResult>(`${this.url}/user/product?subcategory_id=${subcategory_id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getBySearch(search: string) {
    return this.http.get<HttpResult>(`${this.url}/user/product?search=${search}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getById(id: number) {
    return this.http.get<HttpResult>(`${this.url}/user/product/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
