import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CurrentOrder } from 'src/app/models/current-order.model';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { ListProfileComponent } from '../list-profile/list-profile.component';
import { ModalAuthComponent } from '../modal-auth/modal-auth.component';
import { ModalChooseLocationComponent } from '../modal-choose-location/modal-choose-location.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  public user: any;

  public order: CurrentOrder;

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private OrderSrv: OrderService,
    private authSrv: AuthService,
    private popoverCtrl: PopoverController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {

    this.initOrder();

    this.initUser();

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public home() {
    this.navCtrl.navigateRoot('/', {
      animationDirection: 'forward'
    });
  }

  public async location() {

    const modal = await this.modalCtrl.create({
      component: ModalChooseLocationComponent,
      backdropDismiss: false
    });

    return await modal.present();

  }  

  public async profile(event: any) {

    if (this.user) {

      const modal = await this.popoverCtrl.create({
        component: ListProfileComponent,
        cssClass: 'popover-profile',
        event: event
      });
    
      return await modal.present();

    }

    else {

      const modal = await this.modalCtrl.create({
        component: ModalAuthComponent,
        backdropDismiss: false,
        cssClass: 'modal-sm'
      });
    
      return await modal.present();

    }

  }

  private initOrder() {
    this.OrderSrv.currentOrder.pipe(takeUntil(this.unsubscribe))
      .subscribe(order => {
        this.order = order;
      });
  }

  private initUser() {
    this.authSrv.currentUser.pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
        this.user = user;
      });
  }

}
