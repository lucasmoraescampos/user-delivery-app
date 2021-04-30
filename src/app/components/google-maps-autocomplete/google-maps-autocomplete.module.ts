import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsAutocompleteComponent } from './google-maps-autocomplete.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  declarations: [GoogleMapsAutocompleteComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    NgxLoadingModule
  ],
  exports: [GoogleMapsAutocompleteComponent]
})
export class GoogleMapsAutocompleteModule { }
