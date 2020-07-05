import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardOptionsPage } from './card-options.page';

const routes: Routes = [
  {
    path: '',
    component: CardOptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardOptionsPageRoutingModule {}
