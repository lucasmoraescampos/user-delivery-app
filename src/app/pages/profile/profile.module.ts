import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabProfilePageRoutingModule } from './profile-routing.module';
import { TabProfilePage } from './profile.page';
import { ListProfileModule } from 'src/app/components/list-profile/list-profile.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabProfilePageRoutingModule,
    ListProfileModule
  ],
  declarations: [TabProfilePage]
})
export class TabProfilePageModule {}
