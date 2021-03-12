import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalChoosePaymentMethodComponent } from './modal-choose-payment-method.component';
import { IonicModule } from '@ionic/angular';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';
import { FormsModule } from '@angular/forms';
import { ModalCardModule } from '../modal-card/modal-card.module';

@NgModule({
  declarations: [ModalChoosePaymentMethodComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    CustomScrollModule,
    ModalCardModule
  ]
})
export class ModalChoosePaymentMethodModule { }
