import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CardOptionsPage } from './card-options.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [CardOptionsPage],
  entryComponents: [CardOptionsPage]
})
export class CardOptionsPageModule { }
