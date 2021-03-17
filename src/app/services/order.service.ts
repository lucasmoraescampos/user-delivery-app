import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ArrayHelper } from '../helpers/array.helper';
import { ConfigHelper } from '../helpers/config.helper';
import { CompanyOrder } from '../models/company-order.model';
import { CurrentLocation } from '../models/current-location.model';
import { CurrentOrder } from '../models/current-order.model';
import { ProductOrder } from '../models/product-order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private url: string = environment.apiUrl;

  private currentOrderSubject: BehaviorSubject<CurrentOrder>;

  public currentOrder: Observable<CurrentOrder>;

  constructor(
    private http: HttpClient
  ) {
    this.initCurrentOrder();
  }

  public getCurrentOrder() {
    return this.currentOrderSubject.value;
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
    if (order.products.length == 0) {
      this.clear();
    }
    else {
      localStorage.setItem(ConfigHelper.Storage.CurrentOrder, JSON.stringify(order));
      this.currentOrderSubject.next(order);
    }
  }

  public setCompany(company: CompanyOrder) {
    const order = this.currentOrderSubject.value;
    order.company = {
      id: company.id,
      name: company.name,
      slug: company.slug,
      open: company.open,
      min_order_value: company.min_order_value,
      delivery_price: company.delivery_price,
      radius: company.radius,
      evaluation: company.evaluation,
      waiting_time: company.waiting_time,
      street_name: company.street_name,
      street_number: company.street_number,
      complement: company.complement,
      district: company.district,
      allow_payment_delivery: company.allow_payment_delivery,
      allow_payment_online: company.allow_payment_online,
      allow_withdrawal_local: company.allow_withdrawal_local,
      payment_methods: company.payment_methods
    };
    this.currentOrderSubject.next(order);
    localStorage.setItem(ConfigHelper.Storage.CurrentOrder, JSON.stringify(order));
  }

  public setLocation(location: CurrentLocation) {
    const order = this.currentOrderSubject.value;
    order.location = location;
    this.currentOrderSubject.next(order);
    localStorage.setItem(ConfigHelper.Storage.CurrentOrder, JSON.stringify(order));
  }

  /** @param type: delivery = 1 | withdrawal local = 2 */
  public setType(type: 1 | 2) {
    const order = this.currentOrderSubject.value;
    order.type = type;
    this.currentOrderSubject.next(order);
    localStorage.setItem(ConfigHelper.Storage.CurrentOrder, JSON.stringify(order));
  }

  /** @param type: online payment = 1 | delivery payment = 2 */
  public setPaymentType(payment_type: 1 | 2) {
    const order = this.currentOrderSubject.value;
    order.payment_type = payment_type;
    this.currentOrderSubject.next(order);
    localStorage.setItem(ConfigHelper.Storage.CurrentOrder, JSON.stringify(order));
  }

  public setPaymentMethod(payment_method: any, change_money?: any) {
    const order = this.currentOrderSubject.value;
    if (payment_method) {
      order.payment_method = {
        id: payment_method.id,
        name: payment_method.name,
        icon: payment_method.icon,
        allow_change_money: payment_method.allow_change_money,
        change_money: change_money
      };
    }
    else {
      delete order.payment_method;
    }
    this.currentOrderSubject.next(order);
    localStorage.setItem(ConfigHelper.Storage.CurrentOrder, JSON.stringify(order));
  }

  public setCard(card: any) {
    const order = this.currentOrderSubject.value;
    if (card) {
      order.card = {
        id: card.id,
        number: card.number,
        icon: card.icon,
        holder_name: card.holder_name
      };
    }
    else {
      delete order.card;
    }
    this.currentOrderSubject.next(order);
    localStorage.setItem(ConfigHelper.Storage.CurrentOrder, JSON.stringify(order));
  }

  public clear() {

    const order: CurrentOrder = {
      company: null,
      location: null,
      products: [],
      type: null,
      payment_type: null
    };

    this.currentOrderSubject.next(order);
    
    localStorage.setItem(ConfigHelper.Storage.CurrentOrder, JSON.stringify(order));

  }

  private initCurrentOrder() {

    const currentOrder = JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentOrder));

    if (currentOrder == null) {

      this.currentOrderSubject = new BehaviorSubject<CurrentOrder>({
        company: null,
        location: null,
        products: [],
        type: null,
        payment_type: null
      });

      this.currentOrder = this.currentOrderSubject.asObservable();

    }

    else {

      this.currentOrderSubject = new BehaviorSubject<CurrentOrder>(currentOrder);

      this.currentOrder = this.currentOrderSubject.asObservable();

    }
    
  }

}
