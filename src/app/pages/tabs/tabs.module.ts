import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';
import { MoneyModule } from 'src/app/pipes/money/money.module';
import { ModalBagModule } from 'src/app/components/modal-bag/modal-bag.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    MoneyModule,
    ModalBagModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
