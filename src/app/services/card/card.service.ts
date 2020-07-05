import { Injectable } from '@angular/core';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpResult } from 'src/app/models/HttpResult';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) {
  }

  public get() {
    return this.http.get<HttpResult>(`${this.url}/user/card`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public create(data: any) {
    return this.http.post<HttpResult>(`${this.url}/user/card`, data)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public update(id: number, data: any) {
    return this.http.put<HttpResult>(`${this.url}/user/card/${id}`, data)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public delete(id: number) {
    return this.http.delete<HttpResult>(`${this.url}/user/card/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  
}
