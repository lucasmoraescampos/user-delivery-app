import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LocationsPageRoutingModule } from './locations-routing.module';
import { LocationsPage } from './locations.page';
import { LocationOptionsPageModule } from 'src/app/pages/popovers/location-options/location-options.module';
import { CartPageModule } from 'src/app/pages/modals/cart/cart.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartPageModule,
    LocationsPageRoutingModule,
    LocationOptionsPageModule
  ],
  declarations: [LocationsPage]
})
export class LocationsPageModule {}
