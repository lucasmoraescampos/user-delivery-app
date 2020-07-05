import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import { ProductDetailsPageModule } from '../modals/product-details/product-details.module';
import { MoneyModule } from '../../pipes/money/money.module';
import { ButtonCartModule } from 'src/app/components/button-cart/button-cart.module';
import { DistanceModule } from 'src/app/pipes/distance/distance.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoneyModule,
    DistanceModule,
    ButtonCartModule,
    ProductDetailsPageModule,
    ProductsPageRoutingModule
  ],
  declarations: [ProductsPage]
})
export class ProductsPageModule {}
