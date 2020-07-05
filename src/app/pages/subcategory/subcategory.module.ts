import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SubcategoryPageRoutingModule } from './subcategory-routing.module';
import { SubcategoryPage } from './subcategory.page';
import { MoneyModule } from '../../pipes/money/money.module';
import { DistanceModule } from '../../pipes/distance/distance.module';
import { ButtonCartModule } from 'src/app/components/button-cart/button-cart.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoneyModule,
    DistanceModule,
    ButtonCartModule,
    SubcategoryPageRoutingModule
  ],
  declarations: [SubcategoryPage]
})
export class SubcategoryPageModule { }
