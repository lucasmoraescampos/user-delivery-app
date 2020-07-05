import { Injectable } from '@angular/core';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpResult } from 'src/app/models/HttpResult';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) {
  }

  public get() {
    return this.http.get<HttpResult>(`${this.url}/user/category`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
