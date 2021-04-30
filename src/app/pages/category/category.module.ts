import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CategoryPageRoutingModule } from './category-routing.module';
import { CategoryPage } from './category.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { CardCompanyModule } from 'src/app/components/card-company/card-company.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryPageRoutingModule,
    HeaderModule,
    CardCompanyModule
  ],
  declarations: [CategoryPage]
})
export class CategoryPageModule {}
