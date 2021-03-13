import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CardService } from 'src/app/services/card.service';
import { ModalCardComponent } from '../modal-card/modal-card.component';

@Component({
  selector: 'app-modal-choose-payment-method',
  templateUrl: './modal-choose-payment-method.component.html',
  styleUrls: ['./modal-choose-payment-method.component.scss'],
})
export class ModalChoosePaymentMethodComponent implements OnInit, OnDestroy {

  @ViewChild(IonSlides) slides: IonSlides;

  @Input() user: any;

  @Input() company: any;

  public loading: boolean;

  public segment: number;

  public options: any;

  public cards: any[];
  
  public selectedPaymentMethod: any;

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private cardSrv: CardService
  ) { }

  ngOnInit() {

    this.initCards();
    
    if (this.company.allow_payment_online) {
      this.segment = 0;
      this.options =  {
        initialSlide: 0
      }
    }
    else {
      this.segment = 1;
      this.options =  {
        initialSlide: 1
      }
    }

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
    this.selectedPaymentMethod = null;
    this.slides.slideTo(ev.detail.value);
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

  public initCards() {
    this.loading = true;
    this.cardSrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loading = false;
        this.cards = res.data;
      });
  }

  public confirmPaymentMethod() {
    
  }
}

