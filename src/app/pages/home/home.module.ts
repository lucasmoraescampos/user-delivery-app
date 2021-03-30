import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { ModalChooseLocationModule } from 'src/app/components/modal-choose-location/modal-choose-location.module';
import { MoneyModule } from 'src/app/pipes/money.module';
import { ModalProductModule } from 'src/app/components/modal-product/modal-product.module';
import { CurrentOrderModule } from 'src/app/components/current-order/current-order.module';
import { ModalAuthModule } from 'src/app/components/modal-auth/modal-auth.module';
import { ListProfileModule } from 'src/app/components/list-profile/list-profile.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ModalChooseLocationModule,
    MoneyModule,
    ModalProductModule,
    CurrentOrderModule,
    ModalAuthModule,
    ListProfileModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
