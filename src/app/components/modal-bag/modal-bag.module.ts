import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalBagComponent } from './modal-bag.component';
import { IonicModule } from '@ionic/angular';
import { CurrentOrderModule } from '../current-order/current-order.module';

@NgModule({
  declarations: [ModalBagComponent],
  imports: [
    CommonModule,
    IonicModule,
    CurrentOrderModule
  ],
  exports: [ModalBagComponent]
})
export class ModalBagModule { }
