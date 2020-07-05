import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CartPage } from './cart.page';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { PaymentMethodPageModule } from '../payment-method/payment-method.module';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoneyModule,
    PaymentMethodPageModule,
    NgxLoadingModule
  ],
  declarations: [CartPage],
  entryComponents: [CartPage]
})
export class CartPageModule {}

