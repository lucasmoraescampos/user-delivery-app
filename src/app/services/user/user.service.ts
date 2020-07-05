import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigHelper } from '../../helpers/ConfigHelper';
import { HttpResult } from '../../models/HttpResult';
import { User } from '../../models/User';
import { ArrayHelper } from 'src/app/helpers/ArrayHelper';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string = ConfigHelper.Url;

  private currentUserSubject: BehaviorSubject<any>;

  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentUser)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public auth() {
    return this.currentUserSubject.value;
  }

  public static auth() {
    return JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentUser));
  }

  public verifyPhone(phone: string) {
    return this.http.post<HttpResult>(`${this.url}/user/verify/phone`, { phone })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public verifyEmail(email: string) {
    return this.http.post<HttpResult>(`${this.url}/user/verify/email`, { email })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public sendRegisterCodeConfirmation(phone: string) {
    return this.http.post<HttpResult>(`${this.url}/user/sendRegisterCodeConfirmation`, { phone })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public sendLoginCodeConfirmation(phone: string) {
    return this.http.post<HttpResult>(`${this.url}/user/sendLoginCodeConfirmation`, { phone })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public registerWithPhone(user: User) {
    return this.http.post<HttpResult>(`${this.url}/user/registerWithPhone`, user)
      .pipe(
        map(res => {
          if (res.success) {
            localStorage.setItem(ConfigHelper.Storage.AccessToken, res.token);
            localStorage.setItem(ConfigHelper.Storage.CurrentUser, JSON.stringify(res.data));
            this.currentUserSubject.next(res.data);
          }
          return res;
        })
      );
  }

  public loginWithConfirmationCode(phone: string, sms_code: string) {
    return this.http.post<HttpResult>(`${this.url}/user/loginWithConfirmationCode`, { phone, sms_code })
      .pipe(
        map(res => {
          if (res.success) {
            localStorage.setItem(ConfigHelper.Storage.AccessToken, res.token);
            localStorage.setItem(ConfigHelper.Storage.CurrentUser, JSON.stringify(res.data));
            this.currentUserSubject.next(res.data);
          }
          return res;
        })
      );
  }

  public logout() {

    const token = localStorage.getItem(ConfigHelper.Storage.AccessToken);

    return this.http.post<HttpResult>(`${this.url}/user/logout`, { token })
      .pipe(
        map(res => {
          return res;
        })
      );
      
  }

  public static currentPaymentMethod() {

    return JSON.parse(localStorage.getItem(ConfigHelper.Storage.PaymentMethod));

  }

  public static setPaymentMethod(method: any) {

    localStorage.setItem(ConfigHelper.Storage.PaymentMethod, JSON.stringify(method));

  }

  public static removeCurrentPaymentMethod() {

    localStorage.removeItem(ConfigHelper.Storage.PaymentMethod);

  }

  public static searches() {

    return JSON.parse(localStorage.getItem(ConfigHelper.Storage.Searches));

  }

  public static setSearch(search: string) {

    const searches = JSON.parse(localStorage.getItem(ConfigHelper.Storage.Searches));

    if (searches != null) {

      searches.unshift(search);

      if (searches.length > 5) {

        searches.pop();

      }

      localStorage.setItem(ConfigHelper.Storage.Searches, JSON.stringify(searches));

    }

    else {

      localStorage.setItem(ConfigHelper.Storage.Searches, JSON.stringify([search]));

    }

  }

  public static removeSearches() {

    localStorage.removeItem(ConfigHelper.Storage.Searches);

  }

  public static removeSearchByIndex(index: number) {

    let searches = JSON.parse(localStorage.getItem(ConfigHelper.Storage.Searches));

    searches = ArrayHelper.RemoveItem(searches, index);

    localStorage.setItem(ConfigHelper.Storage.Searches, JSON.stringify(searches));

  }
}
