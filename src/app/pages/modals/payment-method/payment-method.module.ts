import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PaymentMethodPage } from './payment-method.page';
import { CreditCardPageModule } from '../credit-card/credit-card.module';
import { NgxLoadingModule } from 'ngx-loading';
import { CardOptionsPageModule } from '../../popovers/card-options/card-options.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreditCardPageModule,
    CardOptionsPageModule,
    NgxLoadingModule
  ],
  declarations: [PaymentMethodPage],
  entryComponents: [PaymentMethodPage]
})
export class PaymentMethodPageModule { }
