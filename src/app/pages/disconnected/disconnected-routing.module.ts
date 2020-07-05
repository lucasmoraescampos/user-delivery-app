import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisconnectedPage } from './disconnected.page';

const routes: Routes = [
  {
    path: '',
    component: DisconnectedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisconnectedPageRoutingModule {}
