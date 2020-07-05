import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { MercadoPagoService } from 'src/app/services/mercado-pago/mercado-pago.service';
import { CardService } from 'src/app/services/card/card.service';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.page.html',
  styleUrls: ['./credit-card.page.scss'],
})
export class CreditCardPage implements OnInit {

  public spinner: boolean = false;

  public formGroupCard: FormGroup;

  private payment_method: any;

  private card: any;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private toastSrv: ToastService,
    private mercadoPagoSrv: MercadoPagoService,
    private cardSrv: CardService,
    private navParams: NavParams
  ) { }

  ngOnInit() {

    this.card = this.navParams.get('card');

    if (this.card) {

      this.formGroupCard = this.formBuilder.group({
        expiration_date: [`${this.card.expiration_month}/${this.card.expiration_year}`, Validators.required],
        security_code: ['', Validators.required],
        holder_name: [this.card.holder_name, Validators.required],
        holder_document_number: [this.card.holder_document_number, Validators.required]
      });

    }

    else {

      this.formGroupCard = this.formBuilder.group({
        number: ['', Validators.required],
        expiration_date: ['', Validators.required],
        security_code: ['', Validators.required],
        holder_name: ['', Validators.required],
        holder_document_number: ['', Validators.required]
      });

    }

  }

  public dismiss() {

    this.modalCtrl.dismiss();

  }

  public create() {

    if (this.formGroupCard.valid && this.payment_method !== false) {

      this.spinner = true;

      const data = this.formGroupCard.value;

      const number = data.number.replace(/\D/gim, '');

      const expiration_month = data.expiration_date.split('/')[0];

      const expiration_year = data.expiration_date.split('/')[1];

      const holder_document_number = data.holder_document_number.replace(/\D/gim, '');

      const holder_document_type = holder_document_number.length > 11 ? 'CNPJ' : 'CPF';

      const card: any = {
        number: number,
        expiration_month: expiration_month,
        expiration_year: expiration_year,
        security_code: data.security_code,
        holder_name: data.holder_name,
        holder_document_number: holder_document_number,
        holder_document_type: holder_document_type,
        payment_method: this.payment_method.id
      };

      this.mercadoPagoSrv.createToken(card, (status: any, response: any) => {

        if (status == 200 || status == 201) {

          card.token = response.id;

          this.cardSrv.create(card)
            .subscribe(res => {

              this.spinner = false;

              if (res.success) {

                this.modalCtrl.dismiss(card);

              }

              else {

                this.toastSrv.error(res.message);

              }

            });

        }

        else {

          this.toastSrv.error('Cartão de crédito invalido!');

        }

      });

    }

    else if (this.payment_method === false) {

      this.toastSrv.error('O número do cartão é invalido!');

    }

    else {

      this.toastSrv.error('Informe todos os dados!');

    }

  }

  public update() {

    if (this.formGroupCard.valid) {

      this.spinner = true;

      const data = this.formGroupCard.value;

      const expiration_month = data.expiration_date.split('/')[0];

      const expiration_year = data.expiration_date.split('/')[1];

      const holder_document_number = data.holder_document_number.replace(/\D/gim, '');

      const holder_document_type = holder_document_number.length > 11 ? 'CNPJ' : 'CPF';

      const card: any = {
        number: this.card.number,
        expiration_month: expiration_month,
        expiration_year: expiration_year,
        security_code: data.security_code,
        holder_name: data.holder_name,
        holder_document_number: holder_document_number,
        holder_document_type: holder_document_type,
        payment_method: this.card.payment_method
      };

      this.mercadoPagoSrv.createToken(card, (status: any, response: any) => {

        if (status == 200 || status == 201) {

          card.token = response.id;

          this.cardSrv.update(this.card.id, card)
            .subscribe(res => {

              this.spinner = false;

              if (res.success) {

                this.modalCtrl.dismiss(card);

              }

              else {

                this.toastSrv.error(res.message);

              }

            });

        }

        else {

          this.toastSrv.error('Cartão de crédito invalido!');

        }

      });

    }

    else {

      this.toastSrv.error('Informe todos os dados!');

    }

  }

  public guessPaymentMethod() {

    let cardnumber = this.formGroupCard.value.number.replace(/\D/gim, '');

    this.mercadoPagoSrv.getPaymentMethod(cardnumber, (status: any, response: any) => {

      if (status == 200) {

        this.payment_method = response[0];

      }

      else {

        this.payment_method = false;

      }

    });

  }
}
