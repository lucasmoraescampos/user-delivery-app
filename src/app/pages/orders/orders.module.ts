import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabOrdersPageRoutingModule } from './orders-routing.module';
import { TabOrdersPage } from './orders.page';
import { ModalOrderModule } from 'src/app/components/modal-order/modal-order.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabOrdersPageRoutingModule,
    ModalOrderModule
  ],
  declarations: [TabOrdersPage]
})
export class TabOrdersPageModule {}
