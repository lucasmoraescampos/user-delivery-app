import { Injectable } from '@angular/core';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpResult } from 'src/app/models/HttpResult';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private url: string = ConfigHelper.Url;

  private currentOrderSubject: BehaviorSubject<any>;

  public currentOrder: Observable<any>;
  
  constructor(
    private http: HttpClient
  ) {

    this.currentOrderSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentOrder)));
    
    this.currentOrder = this.currentOrderSubject.asObservable();

  }

  public get() {

    return this.http.get<HttpResult>(`${this.url}/user/order`)
      .pipe(
        map(res => {
          return res;
        })
      );

  }

  public getById(id: number) {

    return this.http.get<HttpResult>(`${this.url}/user/order/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );

  }

  public create(data: any) {

    return this.http.post<HttpResult>(`${this.url}/user/order`, data)
      .pipe(
        map(res => {
          return res;
        })
      );

  }

  public update(id: number, data: any) {

    return this.http.put<HttpResult>(`${this.url}/user/order/${id}`, data)
      .pipe(
        map(res => {
          return res;
        })
      );

  }

  public addProduct(product: any, company_id: number) {

    let order = this.currentOrderSubject.value;

    if (order !== null) {

      order.products.push(product);

    }

    else {

      order = {
        company_id: company_id,
        products: [product]
      };

    }

    localStorage.setItem(ConfigHelper.Storage.CurrentOrder, JSON.stringify(order));

    this.currentOrderSubject.next(order);

  }

  public addProductDetails(product: any) {

    let products = JSON.parse(localStorage.getItem(ConfigHelper.Storage.ProductsDetails));

    if (products !== null) {

      products.push(product);

    }

    else {

      products = [];

      products.push(product);

    }

    localStorage.setItem(ConfigHelper.Storage.ProductsDetails, JSON.stringify(products));

  }

  public getTotalPrice() {

    let price: number = 0;

    let products = JSON.parse(localStorage.getItem(ConfigHelper.Storage.ProductsDetails));

    products.forEach(product => {
      price += product.price;
    });

    return price;

  }

  public static getCurrentOrder() {

    return JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentOrder));

  }

  public static productDetails() {

    return JSON.parse(localStorage.getItem(ConfigHelper.Storage.ProductsDetails));

  }

  public remove() {

    localStorage.removeItem(ConfigHelper.Storage.CurrentOrder);

    localStorage.removeItem(ConfigHelper.Storage.ProductsDetails);

    localStorage.removeItem(ConfigHelper.Storage.PaymentMethod);

    this.currentOrderSubject.next(null);

  }

}