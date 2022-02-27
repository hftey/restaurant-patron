import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QiInfoPage } from './qi-info.page';

const routes: Routes = [
  {
    path: '',
    component: QiInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QiInfoPageRoutingModule {}
