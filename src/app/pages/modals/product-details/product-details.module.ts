import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductDetailsPage } from './product-details.page';
import { QuantityModule } from '../../../components/quantity/quantity.module';
import { MoneyModule } from '../../../pipes/money/money.module';
import { NgxLoadingModule } from 'ngx-loading';
import { CartPageModule } from '../cart/cart.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    QuantityModule,
    MoneyModule,
    IonicModule,
    CartPageModule,
    NgxLoadingModule
  ],
  declarations: [ProductDetailsPage],
  entryComponents: [ProductDetailsPage]
})
export class ProductDetailsPageModule {}
