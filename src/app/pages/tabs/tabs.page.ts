import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalBagComponent } from 'src/app/components/modal-bag/modal-bag.component';
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

  public tabs: any[] = [
    { label: 'Início',  icon: '../../../assets/icon/home.svg',    path: 'home'     },
    { label: 'Busca',   icon: '../../../assets/icon/search.svg',  path: 'search'   },
    { label: 'Pedidos', icon: '../../../assets/icon/order.svg',   path: 'orders'   },
    { label: 'Perfil',  icon: '../../../assets/icon/user.svg',    path: 'profile'  }
  ];

  private unsubscribe = new Subject();

  constructor(
    private orderSrv: OrderService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {

    this.initOrder();

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public async bag() {
    const modal = await this.modalCtrl.create({
      component: ModalBagComponent,
      backdropDismiss: false,
      componentProps: {
        allowClosing: false
      }
    });

    return await modal.present();
  }

  private initOrder() {
    this.orderSrv.currentOrder.pipe(takeUntil(this.unsubscribe))
      .subscribe(order => {
        this.order = order;
        this.total = this.orderSrv.getSubtotal() + this.order.company?.delivery_price;
      });
  }

}
