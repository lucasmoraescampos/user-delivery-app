import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompanyPageRoutingModule } from './company-routing.module';
import { CompanyPage } from './company.page';
import { CurrentOrderModule } from 'src/app/components/current-order/current-order.module';
import { ListProfileModule } from 'src/app/components/list-profile/list-profile.module';
import { ModalAuthModule } from 'src/app/components/modal-auth/modal-auth.module';
import { ModalChooseLocationModule } from 'src/app/components/modal-choose-location/modal-choose-location.module';
import { ModalProductModule } from 'src/app/components/modal-product/modal-product.module';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyPageRoutingModule,
    ModalChooseLocationModule,
    MoneyModule,
    ModalProductModule,
    CurrentOrderModule,
    ModalAuthModule,
    ListProfileModule,
    HeaderModule
  ],
  declarations: [CompanyPage]
})
export class CompanyPageModule {}
