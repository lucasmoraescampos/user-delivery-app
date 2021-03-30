import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalOrderComponent } from 'src/app/components/modal-order/modal-order.component';
import { LoadingService } from 'src/app/services/loading.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class TabOrdersPage implements OnInit, OnDestroy {

  public orders: any[];

  private unsubscribe = new Subject();

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private orderSrv: OrderService,
    private loadingSrv: LoadingService
  ) { }

  ngOnInit() {
    this.initOrders();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public back() {
    this.navCtrl.back();
  }

  public async modalOrder(order: any) {

    const modal = await this.modalCtrl.create({
      component: ModalOrderComponent,
      backdropDismiss: false,
      componentProps: {
        order: order
      }
    });
  
    return await modal.present();
    
  }

  private initOrders() {
    this.loadingSrv.show();
    this.orderSrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loadingSrv.hide();
        if (res.success) {
          this.orders = res.data;
        }
      });
  }

}
