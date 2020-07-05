import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationOptionsPage } from './location-options.page';

const routes: Routes = [
  {
    path: '',
    component: LocationOptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationOptionsPageRoutingModule {}
