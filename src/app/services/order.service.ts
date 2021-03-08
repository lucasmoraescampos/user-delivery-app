import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ArrayHelper } from '../helpers/array.helper';
import { ConfigHelper } from '../helpers/config.helper';
import { CurrentLocation } from '../models/current-location.model';
import { CurrentOrder } from '../models/current-order.model';
import { HttpResult } from '../models/http-result.model';
import { ProductOrder } from '../models/product-order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private url: string = ConfigHelper.Url;

  private currentOrderSubject: BehaviorSubject<CurrentOrder>;

  public currentOrder: Observable<CurrentOrder>;

  constructor(
    private http: HttpClient
  ) {
    this.initCurrentOrder();
  }

  public getCurrentOrder() {
    return JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentOrder));
  }

  public addProductCurrentOrder(product: ProductOrder) {
    const order = this.currentOrderSubject.value;
    order.products.push(product);
    localStorage.setItem(ConfigHelper.Storage.CurrentOrder, JSON.stringify(order));
    this.currentOrderSubject.next(order);
  }

  public updateProductCurrentOrder(index: number, product: ProductOrder) {
    const order = this.currentOrderSubject.value;
    order.products[index] = product;
    localStorage.setItem(ConfigHelper.Storage.CurrentOrder, JSON.stringify(order));
    this.currentOrderSubject.next(order);
  }

  public removeProductCurrentOrder(index: number) {
    const order = this.currentOrderSubject.value;
    order.products = ArrayHelper.removeItem(order.products, index);
    localStorage.setItem(ConfigHelper.Storage.CurrentOrder, JSON.stringify(order));
    this.currentOrderSubject.next(order);
  }

  public setLocation(location: CurrentLocation) {
    const order = this.currentOrderSubject.value;
    order.location = location;
    this.currentOrderSubject.next(order);
    localStorage.setItem(ConfigHelper.Storage.CurrentLocation, JSON.stringify(location));
  }

  public setUserId(id: number) {
    const order = this.currentOrderSubject.value;
    order.user_id = id;
    this.currentOrderSubject.next(order);
    localStorage.setItem(ConfigHelper.Storage.CurrentOrder, JSON.stringify(order));
  }

  private initCurrentOrder() {

    const currentOrder = JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentOrder));

    const currentLocation = JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentLocation));

    if (currentOrder == null) {

      this.currentOrderSubject = new BehaviorSubject<CurrentOrder>({
        user_id: null,
        company_id: null,
        location: currentLocation,
        products: []
      });

      this.currentOrder = this.currentOrderSubject.asObservable();

    }

    else {

      currentOrder.location = currentLocation;

      this.currentOrderSubject = new BehaviorSubject<CurrentOrder>(currentOrder);

      this.currentOrder = this.currentOrderSubject.asObservable();

    }
    
  }

}
