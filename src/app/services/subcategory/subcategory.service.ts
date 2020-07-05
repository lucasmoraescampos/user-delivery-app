import { Injectable } from '@angular/core';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpResult } from 'src/app/models/HttpResult';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) {
  }

  public get(category_id: string) {
    return this.http.get<HttpResult>(`${this.url}/user/subcategory?category_id=${category_id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getById(id: string) {
    return this.http.get<HttpResult>(`${this.url}/user/subcategory/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
