import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';
import { ButtonCartModule } from 'src/app/components/button-cart/button-cart.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TabsPageRoutingModule,
    ButtonCartModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
