import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
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
    private cardSrv: CardService
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

      const expiration = this.formControl.expiration.value.split('/');

      const data = {
        number: this.formControl.number.value.replace(/[^0-9]/g, ''),
        expiration_month: expiration[0],
        expiration_year: expiration[1],
        security_code: this.formControl.security_code.value,
        holder_name: this.formControl.holder_name.value,
        document_number: this.formControl.document_number.value.replace(/[^0-9]/g, ''),
        icon: this.paymentMethod.thumbnail
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

  }

}
