import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonCartComponent } from './button-cart.component';
import { IonicModule } from '@ionic/angular';
import { CartPageModule } from 'src/app/pages/modals/cart/cart.module';
import { MoneyModule } from 'src/app/pipes/money/money.module';

@NgModule({
  declarations: [ButtonCartComponent],
  imports: [
    CommonModule,
    IonicModule,
    CartPageModule,
    MoneyModule
  ],
  exports: [
    ButtonCartComponent
  ]
})
export class ButtonCartModule { }
