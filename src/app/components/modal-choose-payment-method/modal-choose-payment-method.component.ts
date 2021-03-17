import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { CurrentOrder } from 'src/app/models/current-order.model';
import { CardService } from 'src/app/services/card.service';
import { OrderService } from 'src/app/services/order.service';
import { ModalCardComponent } from '../modal-card/modal-card.component';
import { ModalChangeMoneyComponent } from '../modal-change-money/modal-change-money.component';

@Component({
  selector: 'app-modal-choose-payment-method',
  templateUrl: './modal-choose-payment-method.component.html',
  styleUrls: ['./modal-choose-payment-method.component.scss'],
})
export class ModalChoosePaymentMethodComponent implements OnInit, OnDestroy {

  @ViewChild(IonSlides) slides: IonSlides;

  @Input() user: any;

  @Input() total: number;

  public loading: boolean;

  public segment: number;

  public options: any;

  public cards: any[];

  public order: CurrentOrder;

  public changeMoney: number;
  
  public selectedPaymentMethod: any;

  public selectedCard: any;

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private cardSrv: CardService,
    private orderSrv: OrderService
  ) { }

  ngOnInit() {
    this.initCards();
    this.initOrder();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  
  ionViewDidEnter() {
    this.slides.update();
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public segmentChanged(ev: any) {
    this.slides.slideTo(ev.detail.value);
  }

  public changeCard(event: CustomEvent) {

    this.selectedCard = event.detail.value;

    if (event.detail.value) {
      this.selectedPaymentMethod = undefined;
    }

  }

  public async changePaymentMethod(event: CustomEvent) {

    this.selectedPaymentMethod = event.detail.value;

    if (event.detail.value) {
      
      this.selectedCard = undefined;

      if (event.detail.value.allow_change_money) {
        
        const modal = await this.modalCtrl.create({
          component: ModalChangeMoneyComponent,
          backdropDismiss: false,
          cssClass: 'modal-xs',
          componentProps: {
            total: this.total
          }
        });
    
        modal.onDidDismiss()
          .then(res => {
            this.changeMoney = res.data;
          });
    
        return await modal.present();

      }

      else {
        this.changeMoney = null;
      }

    }

  }

  public async modalCard() {

    const modal = await this.modalCtrl.create({
      component: ModalCardComponent,
      backdropDismiss: false,
      cssClass: 'modal-sm'
    });

    modal.onDidDismiss()
      .then(res => {
        if (res.data) {
          this.cards.unshift(res.data);
        }
      });

    return await modal.present();

  }
  
  public confirmPaymentMethod() {
    if (this.segment == 0) {
      this.orderSrv.setPaymentType(1);
      this.orderSrv.setCard(this.selectedCard);
      this.orderSrv.setPaymentMethod(null);
      this.modalCtrl.dismiss();
    }
    else {
      this.orderSrv.setPaymentType(2);
      this.orderSrv.setCard(null);
      this.orderSrv.setPaymentMethod(this.selectedPaymentMethod, this.changeMoney);
      this.modalCtrl.dismiss();
    }
  }

  public initCards() {

    this.loading = true;

    this.cardSrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loading = false;

        this.cards = res.data;
        
        if (this.order?.payment_type == 1) {

          const index = ArrayHelper.getIndexByKey(this.cards, 'id', this.order.card.id);
  
          this.selectedCard = this.cards[index];

        }

      });

  }

  public initOrder() {

    this.order = this.orderSrv.getCurrentOrder();

    if (this.order?.payment_type) {

      if (this.order.payment_type == 1) {

        this.segment = 0;

        this.options = {
          initialSlide: 0
        }

      }

      else {

        const index = ArrayHelper.getIndexByKey(this.order.company.payment_methods, 'id', this.order.payment_method.id);

        this.selectedPaymentMethod = this.order.company.payment_methods[index];

        this.segment = 1;

        this.options = {
          initialSlide: 1
        }

      }

    }

    else {

      if (this.order.company.allow_payment_online) {

        this.segment = 0;

        this.options = {
          initialSlide: 0
        }

      }

      else {

        this.segment = 1;

        this.options = {
          initialSlide: 1
        }

      }

    }

  }

}

