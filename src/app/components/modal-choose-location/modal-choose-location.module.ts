import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalChooseLocationComponent } from './modal-choose-location.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  declarations: [ModalChooseLocationComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    CustomScrollModule,
    NgxLoadingModule
  ]
})
export class ModalChooseLocationModule { }
