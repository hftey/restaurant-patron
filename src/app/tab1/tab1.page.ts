import { Component, OnInit, ElementRef, ViewChild, NgZone  } from '@angular/core';
import { Geolocation, Geoposition, PositionError  } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Restaurant, ADDRESS_CITY, ADDRESS_STATE, ADDRESS_COUNTRY } from '../models/restaurants.model';
import {RestaurantService} from "../services/restaurant.service";
import { Router } from '@angular/router';
import { Storage } from  '@ionic/storage';
import {AuthService} from "../auth/auth.service";

declare var google;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

    @ViewChild('map', { static: false }) mapElement: ElementRef;
    restaurant: Restaurant;
    map: any;
    address: string;
    latitude: number;
    longitude: number;


  constructor(private geolocation: Geolocation,private storage: Storage,private authService: AuthService,
              private nativeGeocoder: NativeGeocoder,
              private restaurantService: RestaurantService, private router: Router) {

      this.restaurant = {
          name:'',address:'',city:'',state:'',country:'',phone_number:'',lat:null,lng:null,place_id:'',created_at:'',created_by:null
      };
  }

    ngOnInit() {

        this.storage.get('User').then((user)=>{
            if (!user){
                this.router.navigate(['login']);
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

            const map = new google.maps.Map(
                document.getElementById("map") as HTMLElement,
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

            map.mapTypes.set(customMapTypeId, customMapType);
            map.setMapTypeId(customMapTypeId);


        const card = document.getElementById("pac-card") as HTMLElement;
        const input = document.getElementById("pac-input") as HTMLInputElement;
        const options = {
            fields: ["formatted_address", "address_components", "formatted_phone_number", "opening_hours", "geometry", "name", "photo", "place_id"],
            strictBounds: true,
            types: ["establishment"],
        };

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

        const autocomplete = new google.maps.places.Autocomplete(input, options);

        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        autocomplete.bindTo("bounds", map);

        const infowindow = new google.maps.InfoWindow();
        const infowindowContent = document.getElementById(
            "infowindow-content"
        ) as HTMLElement;

        infowindow.setContent(infowindowContent);

        const marker = new google.maps.Marker({
            map,
            anchorPoint: new google.maps.Point(0, -29),
        });

        autocomplete.addListener("place_changed", () => {
            infowindow.close();
            marker.setVisible(false);

            const place = autocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }

            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            infowindowContent.children["place-name"].textContent = place.name;
            infowindowContent.children["place-address"].textContent =
                place.formatted_address;
            infowindow.open(map, marker);

            var placesService = new google.maps.places.PlacesService(map);
            placesService.getDetails(
                {placeId: place.place_id},
                ((results) => {
                    this.restaurant.name = place.name;
                    this.restaurant.address = place.formatted_address;
                    this.restaurant.city = place.address_components[ADDRESS_CITY].long_name;
                    this.restaurant.state = place.address_components[ADDRESS_STATE].long_name;
                    this.restaurant.country = place.address_components[ADDRESS_COUNTRY].long_name;
                    this.restaurant.phone_number = results.formatted_phone_number;
                    this.restaurant.lat = place.geometry.location.lat();
                    this.restaurant.lng = place.geometry.location.lng();
                    this.restaurant.place_id = place.place_id;
                    this.restaurant.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    this.restaurant.created_by = 1;

                    console.log('model', this.restaurant);
                })
            );

        });

        });
    }

    share_experience(){
        this.restaurantService.update_restaurant(this.restaurant).subscribe(
            result=>{
                console.log(result)
                this.router.navigate(['/experience/'+this.restaurant.place_id+'']);

            },
            error => {
                console.log(error)
            })
    }


}


