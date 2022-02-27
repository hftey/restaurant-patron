import { Component, OnInit, ElementRef, ViewChild, NgZone  } from '@angular/core';
import { Geolocation, Geoposition, PositionError  } from '@ionic-native/geolocation/ngx';
import { Platform, NavController } from "@ionic/angular";
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Restaurant, ADDRESS_CITY, ADDRESS_STATE, ADDRESS_COUNTRY, Coordinate } from '../models/restaurants.model';
import {Router} from "@angular/router";
import {RestaurantService} from "../services/restaurant.service";
declare var google;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

    @ViewChild('map-explore', { static: false }) mapElement: ElementRef;
    map_explore: any;
    latitude: number;
    longitude: number;
    map_bound: Coordinate;
    restaurant: Restaurant[];
    constructor(private geolocation: Geolocation, public platform: Platform,
              private nativeGeocoder: NativeGeocoder,
              private restaurantService: RestaurantService, private router: Router) {}

    ngOnInit() {
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

            this.map_explore = new google.maps.Map(
                document.getElementById("map-explore") as HTMLElement,
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

            this.map_explore.mapTypes.set(customMapTypeId, customMapType);
            this.map_explore.setMapTypeId(customMapTypeId);

            const infowindow_explore = new google.maps.InfoWindow();
            const infowindowContentExplore = document.getElementById(
                "infowindow-content-explore"
            ) as HTMLElement;
            infowindow_explore.setContent(infowindowContentExplore);


            google.maps.event.addListener(this.map_explore, 'idle', () => {
                var bounds =  this.map_explore.getBounds();
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
                            map: this.map_explore,
                            label: {text: rating, color: "white", fontSize: "10px"}
                        })


                        google.maps.event.addListener(marker, 'click', () => {

                            const link = document.createElement("a");
                            link.setAttribute('href', `restaurant/${restaurant.place_id}`);
                            link.textContent = restaurant.name;
                            infowindowContentExplore.children["place-name-explore"].innerHTML = '';
                            infowindowContentExplore.children["place-name-explore"].appendChild(link);

                            //infowindowContentExplore.children["place-name-explore"].firstChild.removeChild();

                            //var item = infowindowContentExplore.children["place-name-explore"].childNodes[0];
                            // var item = document.getElementById("place-name-explore").childNodes[0];
                            // infowindowContentExplore.children["place-name-explore"].replaceChild(link, item.childNodes[0]);

//                            infowindowContentExplore.children["place-link"].children["place-name-explore"].textContent = restaurant.name;
                            infowindowContentExplore.children["place-address-explore"].textContent = restaurant.address;
                            infowindowContentExplore.children["place-phone-explore"].textContent = restaurant.phone_number;
                            infowindowContentExplore.children["rating-info"].children["place-rating-explore"].textContent = rating;
                            infowindowContentExplore.children["rating-info"].children["place-numberexperience-explore"].textContent = (restaurant as any).num_experience;
                            if (rating == '-'){
                                infowindowContentExplore.children["rating-info"].style.display = 'none';
                            }else{
                                infowindowContentExplore.children["rating-info"].style.display = 'block';
                            }

                            infowindow_explore.open(this.map_explore, marker);
                        });

                    });
                });

            });

        });
    }
}
