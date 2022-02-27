import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QiInfoPageRoutingModule } from './qi-info-routing.module';

import { QiInfoPage } from './qi-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QiInfoPageRoutingModule
  ],
  declarations: [QiInfoPage]
})
export class QiInfoPageModule {}
