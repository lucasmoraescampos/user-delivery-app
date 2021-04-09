import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { ModalChooseLocationModule } from 'src/app/components/modal-choose-location/modal-choose-location.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HomePageRoutingModule,
    HeaderModule,
    ModalChooseLocationModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
