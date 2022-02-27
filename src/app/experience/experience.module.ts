import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExperiencePageRoutingModule } from './experience-routing.module';

import { ExperiencePage } from './experience.page';
import { NgbRatingModule} from '@ng-bootstrap/ng-bootstrap';
import { MatInput, MatInputModule} from "@angular/material/input";
import { MatButton, MatButtonModule} from "@angular/material/button";
import { MatIcon, MatIconModule} from "@angular/material/icon";
import { MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import { MatCard, MatCardModule} from "@angular/material/card";
import { MatProgressBar, MatProgressBarModule} from "@angular/material/progress-bar";
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

import {QiInfoPage} from "../qi-info/qi-info.page"

import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,ReactiveFormsModule,NgxIonicImageViewerModule,
    FormsModule,
    IonicModule,
    ExperiencePageRoutingModule,NgbRatingModule, MatInputModule, MatButtonModule, MatIconModule, MatToolbarModule, MatCardModule, MatProgressBarModule,
  ],
  declarations: [ExperiencePage, QiInfoPage],
  exports: [QiInfoPage]
})
export class ExperiencePageModule {}
