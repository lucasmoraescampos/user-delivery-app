import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { CurrentOrder } from 'src/app/models/current-order.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { ModalAuthComponent } from '../modal-auth/modal-auth.component';
import { ModalChooseLocationComponent } from '../modal-choose-location/modal-choose-location.component';
import { ModalChoosePaymentMethodComponent } from '../modal-choose-payment-method/modal-choose-payment-method.component';
import { ModalProductComponent } from '../modal-product/modal-product.component';

@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.component.html',
  styleUrls: ['./current-order.component.scss'],
})
export class CurrentOrderComponent implements OnInit, OnDestroy {

  @Input() products: any[];

  public user: any;

  public order: CurrentOrder;

  public subtotal: number = 0;

  private unsubscribe = new Subject();

  constructor(
    private orderSrv: OrderService,
    private authSrv: AuthService,
    private modalCtrl: ModalController,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {
    this.initUser();
    this.initOrder();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public async edit(index: number) {

    const productOrder = this.order.products[index];

    const productIndex = ArrayHelper.getIndexByKey(this.products, 'id', productOrder.id);

    const modal = await this.modalCtrl.create({
      component: ModalProductComponent,
      backdropDismiss: false,
      cssClass: 'modal-lg',
      componentProps: {
        productOrderIndex: index,
        product: this.products[productIndex]
      }
    });

    return await modal.present();

  }

  public remove(index: number) {
    this.orderSrv.removeProductCurrentOrder(index);
  }

  public async chooseAddress() {
    const modal = await this.modalCtrl.create({
      component: ModalChooseLocationComponent,
      backdropDismiss: false
    });

    return await modal.present();
  }

  public async choosePaymentMethod() {

    if (!this.user) {

      const modal = await this.modalCtrl.create({
        component: ModalAuthComponent,
        backdropDismiss: false,
        cssClass: 'modal-sm'
      });

      modal.onDidDismiss()
        .then(res => {
          if (res.data) {
            this.choosePaymentMethod();
          }
        });

      return await modal.present();

    }

    else {

      const modal = await this.modalCtrl.create({
        component: ModalChoosePaymentMethodComponent,
        backdropDismiss: false,
        componentProps: {
          user: this.user,
          total: this.subtotal + this.order.company.delivery_price
        }
      });

      return await modal.present();

    }

  }

  public request() {

    if (this.subtotal < this.order.company.min_order_value) {

      const min_order_value = UtilsHelper.numberToMoney(this.order.company.min_order_value);

      this.alertSrv.show({
        icon: 'error',
        message: `O pedido mínimo para essa empresa é de R$ ${min_order_value}, não inclusa a taxa de entrega.`,
        confirmButtonText: 'Entendi',
        showCancelButton: false
      });

    }

    else {
      
    }

  }

  private initUser() {
    this.authSrv.currentUser.pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
        this.user = user;
      });
  }

  private initOrder() {

    this.orderSrv.currentOrder.pipe(takeUntil(this.unsubscribe))
      .subscribe(order => {

        this.order = order;

        this.subtotal = 0;

        this.order.products.forEach((product: any) => {

          this.subtotal += product.price;

          product.complements.forEach((complement: any) => {

            complement.subcomplements.forEach((subcomplement: any) => {

              this.subtotal += (subcomplement.price * subcomplement.qty);

            });

          });

          this.subtotal *= product.qty;

        });

      });

  }

}
