import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardCompanyComponent } from './card-company.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [CardCompanyComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [CardCompanyComponent]
})
export class CardCompanyModule { }
