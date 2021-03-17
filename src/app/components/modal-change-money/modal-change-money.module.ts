import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalChangeMoneyComponent } from './modal-change-money.component';
import { IonicModule } from '@ionic/angular';
import { BrMaskerModule } from 'br-mask';
import { FormsModule } from '@angular/forms';
import { MoneyModule } from 'src/app/pipes/money.module';

@NgModule({
  declarations: [ModalChangeMoneyComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    BrMaskerModule,
    MoneyModule
  ]
})
export class ModalChangeMoneyModule { }
