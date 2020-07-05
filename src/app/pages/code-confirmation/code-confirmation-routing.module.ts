import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodeConfirmationPage } from './code-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: CodeConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CodeConfirmationPageRoutingModule {}
