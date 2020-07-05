import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, PopoverController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CreditCardPage } from '../credit-card/credit-card.page';
import { PaymentMethod } from 'src/app/models/PaymentMethod';
import { MercadoPagoService } from 'src/app/services/mercado-pago/mercado-pago.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CardService } from 'src/app/services/card/card.service';
import { CardOptionsPage } from '../../popovers/card-options/card-options.page';
import { ArrayHelper } from 'src/app/helpers/ArrayHelper';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.page.html',
  styleUrls: ['./payment-method.page.scss'],
})
export class PaymentMethodPage implements OnInit {

  public loading: boolean = false;

  public accept_payment_app: any;

  public payment_methods: Array<any>;

  public cards: Array<any>;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private alertSrv: AlertService,
    private mercadoPagoSrv: MercadoPagoService,
    private toastSrv: ToastService,
    private cardSrv: CardService
  ) { }

  ngOnInit() {

    this.accept_payment_app = this.navParams.get('accept_payment_app');

    this.payment_methods = this.navParams.get('payment_methods');

    this.prepareCards();

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public selectPaymentMethod(method: any) {

    if (method.id == 1) {

      this.alertSrv.confirm('Dinheiro', 'Você vai precisar de troco?')
        .then(res => {

          if (res.isConfirmed) {

            const total: number = Number(this.navParams.get('total'));

            let message: string = `O valor total do pedido é ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}.`;

            message += ' Informe quanto vai pagar em dinheiro para que o entregador leve o seu troco.';

            this.alertSrv.input('Troco pra quanto?', message, 'money')
              .then(res => {

                if (res.isConfirmed && Number(res.value) >= total) {

                  const payment_method: PaymentMethod = {
                    type: 2,
                    id: method.id,
                    name: method.name,
                    icon: method.icon,
                    cashback: res.value
                  };

                  UserService.setPaymentMethod(payment_method);

                  this.modalCtrl.dismiss(payment_method);

                }

                else if (Number(res.value) < total) {

                  this.toastSrv.error('Este valor é menor que o valor total do seu pedido. Selecione novamente a forma de pagamento corretamente!', 7000);

                }

              });

          }

          else if (res.dismiss.toString() == 'cancel') {

            const payment_method: PaymentMethod = {
              type: 2,
              id: method.id,
              name: method.name,
              icon: method.icon,
              cashback: null
            };

            UserService.setPaymentMethod(payment_method);

            this.modalCtrl.dismiss(payment_method);

          }

        });

    }

    else {

      const payment_method: PaymentMethod = {
        type: 2,
        id: method.id,
        name: method.name,
        icon: method.icon,
        cashback: null
      };

      UserService.setPaymentMethod(payment_method);

      this.modalCtrl.dismiss(payment_method);

    }

  }

  public selectCreditCard(card: any) {

    this.loading = true;

    this.mercadoPagoSrv.createToken(card, (status: any, response: any) => {

      if (status == 200 || status == 201) {

        let icon: string;

        switch (card.payment_method) {

          case 'amex':

            icon = '../../../../assets/icon/amex.svg';

            break;

          case 'elo':

            icon = '../../../../assets/icon/elo.svg';

            break;

          case 'hipercard':

            icon = '../../../../assets/icon/hipercard.svg';

            break;

          case 'master':

            icon = '../../../../assets/icon/mastercard.svg';

            break;

          case 'visa':

            icon = '../../../../assets/icon/visa.svg';

            break;
        }

        const method: PaymentMethod = {
          type: 1,
          id: card.id,
          icon: icon,
          number: card.number,
          expiration_month: card.expiration_month,
          expiration_year: card.expiration_year,
          security_code: card.security_code,
          holder_name: card.holder_name,
          holder_document_type: card.holder_document_type,
          holder_document_number: card.holder_document_number,
          payment_method: card.payment_method,
          token: response.id
        };

        UserService.setPaymentMethod(method);

        this.modalCtrl.dismiss(method);

      }

    });

  }

  public async addCreditCard() {

    const modal = await this.modalCtrl.create({
      component: CreditCardPage,
      cssClass: 'modal-custom'
    });

    modal.onWillDismiss()
      .then(res => {

        this.loading = true;

        if (res.data != undefined) {

          let icon: string;

          switch (res.data.payment_method) {

            case 'amex':

              icon = '../../../../assets/icon/amex.svg';

              break;

            case 'elo':

              icon = '../../../../assets/icon/elo.svg';

              break;

            case 'hipercard':

              icon = '../../../../assets/icon/hipercard.svg';

              break;

            case 'master':

              icon = '../../../../assets/icon/mastercard.svg';

              break;

            case 'visa':

              icon = '../../../../assets/icon/visa.svg';

              break;
          }

          const method: PaymentMethod = {
            type: 1,
            id: res.data.id,
            icon: icon,
            number: res.data.number,
            expiration_month: res.data.expiration_month,
            expiration_year: res.data.expiration_year,
            security_code: res.data.security_code,
            holder_name: res.data.holder_name,
            holder_document_type: res.data.holder_document_type,
            holder_document_number: res.data.holder_document_number,
            payment_method: res.data.payment_method,
            token: res.data.token
          };

          UserService.setPaymentMethod(method);

          setTimeout(() => {

            this.mercadoPagoSrv.clearSession();

            this.modalCtrl.dismiss(method);

          }, 1500);

        }

        else {
          this.loading = false;
        }

      });

    return await modal.present();

  }

  public async cardOptions(ev: any, card: any) {

    const popover = await this.popoverCtrl.create({
      component: CardOptionsPage,
      event: ev,
      translucent: true,
      mode: 'ios'
    });

    popover.onWillDismiss()
      .then(res => {

        if (res.data == 'change') {

          this.changeCard(card);

        }

        else if (res.data == 'delete') {

          this.deleteCard(card);

        }

      });

    return await popover.present();

  }

  private async changeCard(card: any) {

    const modal = await this.modalCtrl.create({
      component: CreditCardPage,
      cssClass: 'modal-custom',
      componentProps: {
        card: card
      }
    });

    modal.onWillDismiss()
      .then(res => {

        this.loading = true;

        if (res.data != undefined) {

          let icon: string;

          switch (res.data.payment_method) {

            case 'amex':

              icon = '../../../../assets/icon/amex.svg';

              break;

            case 'elo':

              icon = '../../../../assets/icon/elo.svg';

              break;

            case 'hipercard':

              icon = '../../../../assets/icon/hipercard.svg';

              break;

            case 'master':

              icon = '../../../../assets/icon/mastercard.svg';

              break;

            case 'visa':

              icon = '../../../../assets/icon/visa.svg';

              break;
          }

          const method: PaymentMethod = {
            type: 1,
            id: res.data.id,
            icon: icon,
            number: res.data.number,
            expiration_month: res.data.expiration_month,
            expiration_year: res.data.expiration_year,
            security_code: res.data.security_code,
            holder_name: res.data.holder_name,
            holder_document_type: res.data.holder_document_type,
            holder_document_number: res.data.holder_document_number,
            payment_method: res.data.payment_method,
            token: res.data.token
          };

          UserService.setPaymentMethod(method);

          setTimeout(() => {

            this.mercadoPagoSrv.clearSession();

            this.modalCtrl.dismiss(method);

          }, 1500);

        }

        else {
          this.loading = false;
        }

      });

    return await modal.present();

  }

  private deleteCard(card: any) {

    const payment_method = UserService.currentPaymentMethod();

    this.cardSrv.delete(card.id)
      .subscribe(res => {

        if (res.success) {

          const index = ArrayHelper.getIndexByKey(this.cards, 'id', card.id);

          this.cards = ArrayHelper.RemoveItem(this.cards, index);

          if (payment_method.type == 1 && payment_method.number == card.number) {

            UserService.removeCurrentPaymentMethod();

          }

        }

      });
  }

  private prepareCards() {

    this.loading = true;

    this.cardSrv.get()
      .subscribe(res => {

        this.loading = false;

        if (res.success) {

          this.cards = res.data;

        }

      });

  }
}
