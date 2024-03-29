import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalProductComponent } from './modal-product.component';
import { IonicModule } from '@ionic/angular';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { QuantityModule } from '../quantity/quantity.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ModalProductComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    MoneyModule,
    QuantityModule
  ]
})
export class ModalProductModule { }
