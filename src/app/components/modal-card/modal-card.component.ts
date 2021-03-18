import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { AlertService } from 'src/app/services/alert.service';
import { CardService } from 'src/app/services/card.service';
import { MercadoPagoService } from 'src/app/services/mercado-pago.service';

@Component({
  selector: 'app-modal-card',
  templateUrl: './modal-card.component.html',
  styleUrls: ['./modal-card.component.scss'],
})
export class ModalCardComponent implements OnInit, OnDestroy {

  public loading: boolean;

  public paymentMethod: any;

  public submitAttempt: boolean;

  public formGroup: FormGroup;

  private unsubscribe = new Subject();

  constructor(
    private modaltrl: ModalController,
    private formBuilder: FormBuilder,
    private mercadoPagoSrv: MercadoPagoService,
    private cardSrv: CardService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({
      number: ['', [Validators.required, Validators.minLength(18)]],
      expiration: ['', [
        Validators.required,
        function (control: AbstractControl) {
          if (control.value.length > 0) {

            const expiration = control.value.split('/');

            if (expiration.length == 2) {

              const month = new Date().getMonth() + 1;

              const year = new Date().getFullYear();

              if (expiration[1].length < 4) {
                return {
                  date: true,
                  message: 'Informe os 4 digitos do ano.'
                }
              }

              if (Number(expiration[0]) < 1 || Number(expiration[0]) > 12) {
                return {
                  date: true,
                  message: 'Mês inválido.'
                }
              }

              if (Number(expiration[1]) < year || (Number(expiration[1]) == year && Number(expiration[0]) <= month)) {
                return {
                  date: true,
                  message: 'Data expirada.'
                }
              }

            }
            else {
              return {
                date: true,
                message: 'Data inválida.'
              }
            }
          }
        }
      ]],
      security_code: ['', Validators.required],
      holder_name: ['', Validators.required],
      document_number: ['', [
        Validators.required,
        function (control: AbstractControl) {
          if (control.value.length > 0) {
            if (!UtilsHelper.validateDocumentNumber(control.value)) {
              return { document_number: true };
            }
            else {
              return null;
            }
          }
        }
      ]
      ]
    });

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public get formControl() {
    return this.formGroup.controls;
  }

  public dismiss() {
    this.modaltrl.dismiss();
  }

  public changeNumber(event: CustomEvent) {

    const cardnumber = event.detail.value.replace(/[^0-9]/g, '');

    if (cardnumber.length >= 6) {
      this.mercadoPagoSrv.getPaymentMethod(cardnumber, (status: any, response: any) => {
        if (status == 200) {
          this.paymentMethod = response[0];
        } else {
          this.paymentMethod = null;
        }
      });
    }
    else {
      this.paymentMethod = null;
    }

  }

  public save() {

    this.submitAttempt = true;

    if (this.formGroup.valid && this.paymentMethod) {

      this.loading = true;

      const number = this.formControl.number.value.replace(/[^0-9]/g, '');

      const expiration = this.formControl.expiration.value.split('/');

      const document_number = this.formControl.document_number.value.replace(/[^0-9]/g, '');

      this.mercadoPagoSrv.createToken({
        number: number,
        holder_name: this.formControl.holder_name.value,
        expiration_month: expiration[0],
        expiration_year: expiration[1],
        security_code: this.formControl.security_code.value,
        document_type: document_number.length == 11 ? 'CPF' : 'CNPJ',
        document_number: document_number,
      }, (status: any, response: any) => {

        if (status == 200 || status == 201) {

          const data = {
            number: number,
            expiration_month: expiration[0],
            expiration_year: expiration[1],
            security_code: this.formControl.security_code.value,
            holder_name: this.formControl.holder_name.value,
            document_number: document_number,
            payment_method_id: this.paymentMethod.id
          }

          this.cardSrv.create(data)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(res => {
              this.loading = false;
              if (res.success) {
                this.modaltrl.dismiss(res.data);
              }
            });

        }

        else {

          this.loading = false;

          let message = 'Há algo de errado com os dados do cartão. Por favor, verifique os dados digitados.';

          if (ArrayHelper.exist(response.cause, 'code', 'E301')) {
            message = 'Há algo de errado com o número do cartão. Por favor, digite novamente.';
          }

          else if (ArrayHelper.exist(response.cause, 'code', 'E302')) {
            message = 'Há algo de errado com o código de segurança do cartão. Por favor, digite novamente.';
          }

          else if (ArrayHelper.exist(response.cause, 'code', '316')) {
            message = 'Por favor, digite um nome válido para o titular do cartão. Por favor, digite novamente.';
          }

          else if (ArrayHelper.exist(response.cause, 'code', '322') || ArrayHelper.exist(response.cause, 'code', '323') || ArrayHelper.exist(response.cause, 'code', '324')) {
            message = 'Há algo de errado com o CPF/CNPJ do titular do cartão. Por favor, digite novamente.';
          }

          else if (ArrayHelper.exist(response.cause, 'code', '325') || ArrayHelper.exist(response.cause, 'code', '326')) {
            message = 'Há algo de errado com a data de validade do cartão. Por favor, digite novamente.';
          }
          
          this.alertSrv.show({
            icon: 'error',
            message: message,
            confirmButtonText: 'Ok, entendi',
            showCancelButton: false
          });

        }
        
      });

    }

  }

}
