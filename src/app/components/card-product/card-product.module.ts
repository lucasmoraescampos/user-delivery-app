import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardProductComponent } from './card-product.component';
import { IonicModule } from '@ionic/angular';
import { MoneyModule } from 'src/app/pipes/money/money.module';

@NgModule({
  declarations: [CardProductComponent],
  imports: [
    CommonModule,
    IonicModule,
    MoneyModule
  ],
  exports: [CardProductComponent]
})
export class CardProductModule { }
