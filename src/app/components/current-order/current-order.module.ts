import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CurrentOrderComponent } from './current-order.component';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { ModalChooseLocationModule } from '../modal-choose-location/modal-choose-location.module';
import { ModalProductModule } from '../modal-product/modal-product.module';
import { ModalChoosePaymentMethodModule } from '../modal-choose-payment-method/modal-choose-payment-method.module';

@NgModule({
  declarations: [CurrentOrderComponent],
  imports: [
    CommonModule,
    IonicModule,
    MoneyModule,
    ModalChooseLocationModule,
    ModalProductModule,
    ModalChoosePaymentMethodModule
  ],
  exports: [CurrentOrderComponent]
})
export class CurrentOrderModule { }
