import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { IonicStorageModule } from '@ionic/storage-angular';


@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, IonicModule.forRoot(), HttpClientModule, AppRoutingModule, BrowserAnimationsModule, GooglePlaceModule, NgxIonicImageViewerModule, IonicStorageModule.forRoot()],

    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, NativeGeocoder, Geolocation, ImagePicker],
    bootstrap: [AppComponent],
})
export class AppModule {}




