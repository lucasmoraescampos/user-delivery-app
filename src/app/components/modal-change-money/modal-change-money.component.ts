import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-modal-change-money',
  templateUrl: './modal-change-money.component.html',
  styleUrls: ['./modal-change-money.component.scss'],
})
export class ModalChangeMoneyComponent implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;

  @Input() total: number;

  public slideActiveIndex: number = 0;

  public value: string = '0,00';

  constructor(
    private modalCtrl: ModalController,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {}

  ionViewDidEnter() {
    this.slides.update();
  }

  public not() {
    this.modalCtrl.dismiss();
  }

  public yes() {
    this.slideActiveIndex = 1;
    this.slides.slideNext();
  }

  public back() {
    this.slideActiveIndex = 0;
    this.slides.slidePrev();
  }

  public confirm() {

    const value = UtilsHelper.moneyToNumber(this.value);

    if (value <= this.total) {

      const total = UtilsHelper.numberToMoney(this.total);

      this.alertSrv.toast({
        icon: 'error',
        message: `Você deve pedir troco para um valor maior que R$ ${total}.`,
        duration: 6000
      });

    }

    else {

      const total = value - this.total;

      this.modalCtrl.dismiss(total);

    }

  }

}
