import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { CurrentOrder } from 'src/app/models/current-order.model';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MercadoPagoService } from 'src/app/services/mercado-pago.service';
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

  public user: any;

  public order: CurrentOrder;

  public subtotal: number = 0;

  public total: number = 0;

  private unsubscribe = new Subject();

  constructor(
    private orderSrv: OrderService,
    private authSrv: AuthService,
    private modalCtrl: ModalController,
    private alertSrv: AlertService,
    private apiSrv: ApiService,
    private loadingSrv: LoadingService,
    private mercadoPagoSrv: MercadoPagoService,
    private cardSrv: CardService
  ) { }

  ngOnInit() {
    this.initUser();
    this.initOrder();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public edit(index: number) {

    this.loadingSrv.show();

    this.apiSrv.getProductById(this.order.products[index].id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(async res => {

        this.loadingSrv.hide();

        if (res.success) {

          const modal = await this.modalCtrl.create({
            component: ModalProductComponent,
            backdropDismiss: false,
            cssClass: 'modal-lg',
            componentProps: {
              productOrderIndex: index,
              product: res.data
            }
          });
      
          return await modal.present();

        }

      });

  }

  public remove(index: number) {
    this.orderSrv.removeProductCurrentOrder(index);
  }

  public changeType(type: 1 | 2) {
    if (type == 2 && this.order.company.allow_withdrawal_local == false) {

      this.alertSrv.show({
        icon: 'error',
        message: 'Essa empresa não está permitindo retiradas no momento.',
        confirmButtonText: 'Ok, entendi',
        showCancelButton: false
      });

    }
    else {
      this.orderSrv.setType(type);
    }
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
        confirmButtonText: 'Ok, entendi',
        showCancelButton: false
      });

    }

    else {

      this.loadingSrv.show();

      const data: any = {
        type: this.order.type,
        payment_type: this.order.payment_type,
        company_id: this.order.company.id,
        products: []
      }

      this.order.products.forEach(product => {

        const _product: any = {
          id: product.id,
          qty: product.qty,
          note: product.note
        }

        if (product?.complements) {

          _product.complements = [];

          product.complements.forEach(complement => {

            const _complement = {
              id: complement.id,
              subcomplements: []
            }

            complement.subcomplements.forEach(subcomplement => {

              _complement.subcomplements.push({
                id: subcomplement.id,
                qty: subcomplement.qty
              })
              
            });

            _product.complements.push(_complement);

          });

        }

        data.products.push(_product);

      });

      if (this.order.type == 1) { // TYPE DELIVERY
        data.location_id = this.order.location.id;
      }

      if (this.order.payment_type == 1) { // PAYMENT ONLINE

        data.card_id = this.order.card.id;

        this.mercadoPagoSrv.getPaymentMethod(this.order.card.number, (status: any, response: any) => {

          data.payment_method_id = response[0].id;

          this.cardSrv.getById(this.order.card.id)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(res => {

              if (res.success) {

                this.mercadoPagoSrv.createToken({
                  number: res.data.number,
                  holder_name: res.data.holder_name,
                  expiration_month: res.data.expiration_month,
                  expiration_year: res.data.expiration_year,
                  security_code: res.data.security_code,
                  document_type: res.data.document_type,
                  document_number: res.data.document_number,
                }, (status: any, response: any) => {

                  data.card_token = response.id;

                  this.sendRequest(data);

                });
                
              }

            });

        });

      }

      if (this.order.payment_type == 2) { // PAYMENT DELIVERY

        data.payment_method_id = this.order.payment_method.id;

        data.change_money = this.order.payment_method.change_money;

        this.sendRequest(data);

      }
      
    }

  }

  private sendRequest(data: any) {

    this.orderSrv.create(data)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          this.alertSrv.toast({
            icon: 'success',
            message: 'Pedido realizado com sucesso.'
          });

        }

        else {

          this.alertSrv.show({
            icon: 'error',
            message: res.message,
            confirmButtonText: 'Ok, entendi',
            showCancelButton: false
          });

        }

      });

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

        if (order.type == 1) {

          this.total = this.subtotal + order.company?.delivery_price;

        }

        else {

          this.total = this.subtotal;

        }

      });

  }

}
