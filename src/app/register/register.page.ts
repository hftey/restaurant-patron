import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Geolocation, Geoposition, PositionError  } from '@ionic-native/geolocation/ngx';
import {Coordinate, Restaurant} from "../models/restaurants.model";
import {RestaurantService} from "../services/restaurant.service";
import {first} from "rxjs/operators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AuthService } from '.././auth/auth.service';
import { User } from '.././auth/user';
import { Storage } from  '@ionic/storage';

import { AlertService } from "../services/alert.service";
import {Router} from "@angular/router";
declare var google;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    public frmGroup: FormGroup;
    public userInfo: User;
    @ViewChild('map-login', { static: false }) mapElement: ElementRef;
    map_login: any;
    latitude: number;
    longitude: number;
    map_bound: Coordinate;
    restaurant: Restaurant[];

  constructor(private authService: AuthService, private geolocation: Geolocation, private restaurantService: RestaurantService,private router: Router,
              private alert: AlertService, private storage: Storage, private fb: FormBuilder) {
      this.frmGroup = this.fb.group({
          name: ['', Validators.required],
          username: ['', Validators.required],
          email: ['', Validators.required],
          password: ['', Validators.required],
      });

  }

  ngOnInit() {
      this.storage.get('User').then((user)=>{
          if (user){
              console.log('user',user);
              this.router.navigate(['dashboard']);
          }

      })
      this.initMap();
  }

    initMap(): void {

        this.geolocation.getCurrentPosition().then((resp) => {

            this.latitude = resp.coords.latitude;
            this.longitude = resp.coords.longitude;
            var customMapType = new google.maps.StyledMapType([
                {
                    featureType: 'poi.business',
                    elementType: 'labels',
                    stylers: [{visibility: 'off'}]
                }
            ], {
                name: 'Custom Style'
            });
            var customMapTypeId = 'custom_style';

            this.map_login = new google.maps.Map(
                document.getElementById("map-login") as HTMLElement,
                {
                    center: { lat: this.latitude, lng: this.longitude },
                    zoom: 15,
                    fullscreenControl: false,
                    clickableIcons: false,
                    mapTypeControl: false,
                    mapTypeControlOptions: {
                        mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
                    }
                }
            );

            this.map_login.mapTypes.set(customMapTypeId, customMapType);
            this.map_login.setMapTypeId(customMapTypeId);

            google.maps.event.addListener(this.map_login, 'idle', () => {
                var bounds =  this.map_login.getBounds();
                var ne = bounds.getNorthEast();
                var sw = bounds.getSouthWest();

                this.map_bound = {
                    NE:{lat: ne.lat(), lng: ne.lng()},
                    SW:{lat: sw.lat(), lng: sw.lng()}
                }

                this.restaurantService.get_restaurant_bound(this.map_bound).subscribe( bound =>{
                    this.restaurant = bound;


                    this.restaurant.forEach(restaurant => {
                        let rating = (restaurant as any).rating;
                        if (!rating){
                            rating = "-";
                        }
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(restaurant.lat, restaurant.lng),
                            map: this.map_login,
                            label: {text: rating, color: "white", fontSize: "10px"}
                        })

                    });
                });

            });

        });
    }

    onChangeName(){
        this.userInfo = this.frmGroup.value;
        if (this.userInfo.username.length == 0){
            let username = this.userInfo.name.toLowerCase();
            username = username.replace(' ', '-')+'-'+ Math.floor(Math.random() * 9999);
            this.userInfo.username = username;
            this.frmGroup.controls['username'].setValue(this.userInfo.username);

        }

    }

    async clickRegister(){
        this.userInfo = this.frmGroup.value;
        this.authService.register(this.userInfo).subscribe(response => {
            this.alert.show("Sign Up Complete","A verification email has been sent to you. Please click the link in the email to verify the email address.");
            this.router.navigate(['dashboard']);
        },
        error => {
            console.log(error);
        })

    }

}
