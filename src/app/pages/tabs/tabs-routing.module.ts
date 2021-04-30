import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('../search/search.module').then(m => m.TabSearchPageModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('../orders/orders.module').then(m => m.TabOrdersPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.TabProfilePageModule)
      },
      {
        path: 'category/:slug',
        loadChildren: () => import('../category/category.module').then( m => m.CategoryPageModule)
      },
      {
        path: ':slug',
        loadChildren: () => import('../company/company.module').then(m => m.CompanyPageModule)
      },
      {
        path: '**',
        redirectTo: '/home'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
