import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationOptionsPage } from './location-options.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [LocationOptionsPage],
  entryComponents: [LocationOptionsPage]
})
export class LocationOptionsPageModule { }
