import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderHelpPage } from './order-help.page';

const routes: Routes = [
  {
    path: '',
    component: OrderHelpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderHelpPageRoutingModule {}
