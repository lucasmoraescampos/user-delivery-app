import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalChooseLocationComponent } from './modal-choose-location.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { ModalAuthModule } from '../modal-auth/modal-auth.module';

@NgModule({
  declarations: [ModalChooseLocationComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ModalAuthModule,
    NgxLoadingModule
  ]
})
export class ModalChooseLocationModule { }
