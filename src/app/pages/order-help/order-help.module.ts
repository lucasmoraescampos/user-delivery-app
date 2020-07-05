import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderHelpPageRoutingModule } from './order-help-routing.module';

import { OrderHelpPage } from './order-help.page';
import { HelpPageModule } from '../modals/help/help.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpPageModule,
    OrderHelpPageRoutingModule
  ],
  declarations: [OrderHelpPage]
})
export class OrderHelpPageModule {}
