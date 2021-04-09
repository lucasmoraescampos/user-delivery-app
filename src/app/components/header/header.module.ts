import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { IonicModule } from '@ionic/angular';
import { ModalChooseLocationModule } from '../modal-choose-location/modal-choose-location.module';
import { ListProfileModule } from '../list-profile/list-profile.module';
import { ModalAuthModule } from '../modal-auth/modal-auth.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    IonicModule,
    ModalChooseLocationModule,
    ModalAuthModule,
    ListProfileModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule { }
