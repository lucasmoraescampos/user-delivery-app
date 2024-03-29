import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalAuthComponent } from './modal-auth.component';
import { BrMaskerModule } from 'br-mask';
import { NgxLoadingModule } from 'ngx-loading';
import { InputCodeModule } from '../input-code/input-code.module';

@NgModule({
  declarations: [ModalAuthComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    BrMaskerModule,
    ReactiveFormsModule,
    NgxLoadingModule,
    InputCodeModule
  ]
})
export class ModalAuthModule { }
