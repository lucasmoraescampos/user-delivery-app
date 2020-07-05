import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigHelper } from '../../helpers/ConfigHelper';
import { DeliveryLocation } from '../../models/DeliveryLocation';
import { LatLng } from '../../models/LatLng';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpResult } from 'src/app/models/HttpResult';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private deliveryLocationSubject: BehaviorSubject<any>;

  public deliveryLocation: Observable<any>;

  private url: string = ConfigHelper.Url;

  constructor(
    private http: HttpClient
  ) {

    this.deliveryLocationSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(ConfigHelper.Storage.DeliveryLocation)));

    this.deliveryLocation = this.deliveryLocationSubject.asObservable();

  }

  public get() {
    return this.http.get<HttpResult>(`${this.url}/user/location`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getById(id: number) {
    return this.http.get<HttpResult>(`${this.url}/user/location/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public create(data: any) {
    return this.http.post<HttpResult>(`${this.url}/user/location`, data)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public update(id: number, data: any) {
    return this.http.put<HttpResult>(`${this.url}/user/location/${id}`, data)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public delete(id: number) {
    return this.http.delete<HttpResult>(`${this.url}/user/location/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getDeliveryLocation() {
    return this.deliveryLocationSubject.value;
  }

  public static getDeliveryLocation() {
    return JSON.parse(localStorage.getItem(ConfigHelper.Storage.DeliveryLocation));
  }

  public setDeliveryLocation(data: DeliveryLocation) {
    localStorage.setItem(ConfigHelper.Storage.DeliveryLocation, JSON.stringify(data));
    this.deliveryLocationSubject.next(data);
  }

  public static distance(origin: LatLng, destiny: LatLng) {

    if (origin.lat == destiny.lat && origin.lng == destiny.lng) {

      return 0;

    }

    else {

      const radlat1 = Math.PI * origin.lat / 180;

      const radlat2 = Math.PI * destiny.lat / 180;

      const theta = origin.lng - destiny.lng;

      const radtheta = Math.PI * theta / 180;

      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

      dist = dist > 1 ? 1 : dist;

      dist = Math.acos(dist);

      dist = dist * 180 / Math.PI;

      dist = dist * 60 * 1.1515;

      dist = dist * 1.609344;

      return dist;

    }

  }

  public static formatAddressForSearch(predictions: Array<any>) {

    let searchResults = [];

    predictions.forEach(prediction => {

      const description = prediction.description.split(',');

      if (description.length > 2) {

        let title = '';

        let subtitle = description[description.length - 2] + ', ' + description[description.length - 1];

        for (let i = 0; i < description.length - 2; i++) {
          if (i < description.length - 3) {
            title += description[i] += ', ';
          }
          else {
            title += description[i];
          }
        }

        searchResults.push({
          title: title,
          subtitle: subtitle
        });

      }

      else {

        let title = '';

        if (description.length > 1) {

          title = description[description.length - 2] + ', ' + description[description.length - 1];

        }

        else {

          title = description[description.length - 1];

        }

        searchResults.push({
          title: title,
          subtitle: null
        });

      }

    });

    return searchResults;

  }
}
