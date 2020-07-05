import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LocationPageRoutingModule } from './location-routing.module';
import { LocationPage } from './location.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NgxLoadingModule } from 'ngx-loading';
import { AddressPageModule } from 'src/app/pages/modals/address/address.module';
import { CartPageModule } from 'src/app/pages/modals/cart/cart.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxLoadingModule,
    AddressPageModule,
    CartPageModule,
    LocationPageRoutingModule
  ],
  declarations: [LocationPage],
  providers: [
    Geolocation
  ]
})
export class LocationPageModule {}
