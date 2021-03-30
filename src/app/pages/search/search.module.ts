import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabSearchPageRoutingModule } from './search-routing.module';

import { TabSearchPage } from './search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabSearchPageRoutingModule
  ],
  declarations: [TabSearchPage]
})
export class TabSearchPageModule {}
