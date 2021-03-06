import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantPageRoutingModule } from './restaurant-routing.module';
import { NgbRatingModule} from '@ng-bootstrap/ng-bootstrap';
import { RestaurantPage } from './restaurant.page';
import {QiInfoPage} from "../qi-info/qi-info.page";
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,NgbRatingModule,MatButtonModule,
    FormsModule,
    IonicModule,
    RestaurantPageRoutingModule
  ],
  declarations: [RestaurantPage,QiInfoPage],
    exports: [QiInfoPage]
})
export class RestaurantPageModule {}
