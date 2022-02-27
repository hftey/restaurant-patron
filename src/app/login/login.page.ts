import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '.././auth/auth.service';
import { User } from '.././auth/user';
import { Storage } from  '@ionic/storage';
import { AlertService } from "../services/alert.service";
import { first } from 'rxjs/operators';
import { Geolocation, Geoposition, PositionError  } from '@ionic-native/geolocation/ngx';
import {Coordinate, Restaurant} from "../models/restaurants.model";
import {RestaurantService} from "../services/restaurant.service";
declare var google;


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public frmGroupLogin: FormGroup;
  public loginInfo: User;

  @ViewChild('formLogin') formLogin: NgForm;

    @ViewChild('map-login', { static: false }) mapElement: ElementRef;
    map_login: any;
    latitude: number;
    longitude: number;
    map_bound: Coordinate;
    restaurant: Restaurant[];

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, private storage: Storage, private alert: AlertService,
              private geolocation: Geolocation,private restaurantService: RestaurantService
  ){

      this.frmGroupLogin = this.fb.group({
          email: ['', Validators.required],
          password: ['', Validators.required]
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


  async clickLogin(){
      this.loginInfo = this.frmGroupLogin.value;
      if (  !this.loginInfo.email ){
          this.alert.show("", "Email required for login");
          return false;
      }

      if (  !this.loginInfo.password ){
          this.alert.show("", "Password required for login");
          return false;
      }

      this.authService.login(this.loginInfo)
          .pipe(first())
          .subscribe(
      result=>{
          //console.log('login-result',result);
          this.router.navigate(['dashboard']);

        },
      error => {

          this.alert.show("Login Failure", "Email and/or Password not correct");
          this.frmGroupLogin.controls['email'].setValue("");
          this.frmGroupLogin.controls['password'].setValue("");
      })

  }



}
