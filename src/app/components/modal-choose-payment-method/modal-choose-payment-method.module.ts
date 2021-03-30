import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalChoosePaymentMethodComponent } from './modal-choose-payment-method.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ModalCardModule } from '../modal-card/modal-card.module';
import { NgxLoadingModule } from 'ngx-loading';
import { ModalChangeMoneyModule } from '../modal-change-money/modal-change-money.module';

@NgModule({
  declarations: [ModalChoosePaymentMethodComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ModalCardModule,
    NgxLoadingModule,
    ModalChangeMoneyModule
  ]
})
export class ModalChoosePaymentMethodModule { }
