import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCardComponent } from './modal-card.component';
import { IonicModule } from '@ionic/angular';
import { BrMaskerModule } from 'br-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  declarations: [ModalCardComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    BrMaskerModule,
    NgxLoadingModule
  ]
})
export class ModalCardModule { }
