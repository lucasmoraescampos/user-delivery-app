import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { ModalCardComponent } from '../modal-card/modal-card.component';

@Component({
  selector: 'app-modal-choose-payment-method',
  templateUrl: './modal-choose-payment-method.component.html',
  styleUrls: ['./modal-choose-payment-method.component.scss'],
})
export class ModalChoosePaymentMethodComponent implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;

  @Input() user: any;

  @Input() company: any;

  public segment: number;

  public options: any;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
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
  
  ionViewDidEnter() {
    this.slides.update();
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public segmentChanged(ev: any) {
    this.slides.slideTo(ev.detail.value);
  }

  public async modalCard() {

    const modal = await this.modalCtrl.create({
      component: ModalCardComponent,
      backdropDismiss: false,
      cssClass: 'modal-sm'
    });

    return await modal.present();

  }
}
