import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DisconnectedPageRoutingModule } from './disconnected-routing.module';
import { DisconnectedPage } from './disconnected.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DisconnectedPageRoutingModule
  ],
  declarations: [DisconnectedPage]
})
export class DisconnectedPageModule { }
