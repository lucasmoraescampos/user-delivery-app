import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProfileComponent } from './list-profile.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ListProfileComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [ListProfileComponent]
})
export class ListProfileModule { }
