import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderLocationSearchComponent } from './header-location-search.component';

@NgModule({
  declarations: [HeaderLocationSearchComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [HeaderLocationSearchComponent]
})
export class HeaderLocationSearchModule { }
