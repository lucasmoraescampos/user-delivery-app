import { Injectable } from '@angular/core';
import { ConfigHelper } from '../helpers/config.helper';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpResult } from '../models/http-result.model';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from 'firebase/app';
import { environment } from 'src/environments/environment';
import * as socketIOClient from 'socket.io-client';
import * as sailsIOClient from 'sails.io.js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private io: sailsIOClient.Client;

  private url: string = environment.apiUrl;

  private currentUserSubject: BehaviorSubject<any>;

  public currentUser: Observable<any>;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private http: HttpClient
  ) {

    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentUser)));

    this.currentUser = this.currentUserSubject.asObservable();

    this.io = sailsIOClient(socketIOClient);

    this.io.sails.url = environment.socketUrl;

  }

  public isLoggedIn() {
    return this.currentUserSubject.value != null;
  }

  public getCurrentUser() {
    return this.currentUserSubject.value;
  }


  // firebase methods

  public signInWithFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.angularFireAuth.signInWithPopup(provider);
  }

  public signInWithGoogle(email?: string) {
    const provider = new firebase.auth.GoogleAuthProvider();
    if (email) {
      provider.setCustomParameters({ login_hint: email });
    }
    return this.angularFireAuth.signInWithPopup(provider);
  }


  // rest methods

  public signUp(data: any) {
    return this.http.post<HttpResult>(`${this.url}/user/sign-up`, data)
      .pipe(map(res => {
        if (res.success) {
          localStorage.setItem(ConfigHelper.Storage.AccessToken, res.token);
          localStorage.setItem(ConfigHelper.Storage.CurrentUser, JSON.stringify(res.data));
          this.currentUserSubject.next(res.data);
        }
        return res;
      }));
  }

  public authenticate(data: any) {
    return this.http.post<HttpResult>(`${this.url}/user/authenticate`, data)
      .pipe(map(res => {
        if (res.success) {
          localStorage.setItem(ConfigHelper.Storage.AccessToken, res.token);
          localStorage.setItem(ConfigHelper.Storage.CurrentUser, JSON.stringify(res.data));
          this.currentUserSubject.next(res.data);
        }
        return res;
      }));
  }

  public authenticateWithProvider(token: string) {
    return this.http.post<HttpResult>(`${this.url}/user/authenticate-with-provider`, { token })
      .pipe(map(res => {
        if (res.success) {
          localStorage.setItem(ConfigHelper.Storage.AccessToken, res.token);
          localStorage.setItem(ConfigHelper.Storage.CurrentUser, JSON.stringify(res.data));
          this.currentUserSubject.next(res.data);
        }
        return res;
      }));
  }

  public logout() {
    const token = localStorage.getItem(ConfigHelper.Storage.AccessToken);
    return this.http.post<HttpResult>(`${this.url}/user/logout`, { token })
      .pipe(map(res => {
        if (res.success) {
          localStorage.setItem(ConfigHelper.Storage.AccessToken, null);
          localStorage.setItem(ConfigHelper.Storage.CurrentUser, null);
          this.currentUserSubject.next(null);
        }
        return res;
      }));
  }

  // socket methods

  public on(callback: (data: any) => any) {
    this.io.socket.on('user', callback);
  }

  public join(callback?: sailsIOClient.RequestCallback) {
    this.io.socket.post('/user/join', callback);
  }

}
