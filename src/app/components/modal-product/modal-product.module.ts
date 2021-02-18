import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalProductComponent } from './modal-product.component';
import { IonicModule } from '@ionic/angular';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';
import { MoneyModule } from 'src/app/pipes/money.module';
import { QuantityModule } from '../quantity/quantity.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ModalProductComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    CustomScrollModule,
    MoneyModule,
    QuantityModule
  ]
})
export class ModalProductModule { }
