import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CodeConfirmationPageRoutingModule } from './code-confirmation-routing.module';
import { CodeConfirmationPage } from './code-confirmation.page';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BrMaskerModule,
    CodeConfirmationPageRoutingModule
  ],
  declarations: [CodeConfirmationPage]
})
export class CodeConfirmationPageModule { }
