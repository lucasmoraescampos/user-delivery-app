import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrderDetailsPage } from './order-details.page';
import { NgxLoadingModule } from 'ngx-loading';
import { MoneyModule } from 'src/app/pipes/money/money.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoneyModule,
    NgxLoadingModule
  ],
  declarations: [OrderDetailsPage],
  entryComponents: [OrderDetailsPage]
})
export class OrderDetailsPageModule { }
