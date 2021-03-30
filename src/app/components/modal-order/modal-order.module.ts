import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalOrderComponent } from './modal-order.component';
import { MoneyModule } from 'src/app/pipes/money.module';

@NgModule({
  declarations: [ModalOrderComponent],
  imports: [
    CommonModule,
    IonicModule,
    MoneyModule
  ]
})
export class ModalOrderModule { }
