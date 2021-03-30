import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CurrentOrder } from 'src/app/models/current-order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {

  public order: CurrentOrder;

  public total: number;

  private unsubscribe = new Subject();

  constructor(
    private orderSrv: OrderService
  ) { }

  ngOnInit() {
    this.initOrder();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private initOrder() {
    this.orderSrv.currentOrder.pipe(takeUntil(this.unsubscribe))
      .subscribe(order => {
        this.order = order;
        this.total = this.orderSrv.getSubtotal() + this.order.company?.delivery_price;
      });
  }

}
