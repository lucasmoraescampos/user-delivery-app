import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompaniesPageRoutingModule } from './companies-routing.module';
import { CompaniesPage } from './companies.page';
import { HeaderLocationSearchModule } from '../../components/header-location-search/header-location-search.module';
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
    HeaderLocationSearchModule,
    CompaniesPageRoutingModule,
    ButtonCartModule
  ],
  declarations: [CompaniesPage]
})
export class CompaniesPageModule { }
