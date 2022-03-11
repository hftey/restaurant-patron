import { Component, OnInit } from '@angular/core';
import {RestaurantService} from "../services/restaurant.service";
import { API_SERVER_URL } from "../../environments/environment";
import { Storage } from  '@ionic/storage';
import { User } from '.././auth/user';
import { AuthService } from '.././auth/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private restaurantService: RestaurantService, private storage: Storage, private authService: AuthService) { }
    top_qi_restaurant: any[];
    top_qi_local: any[];
    API_SERVER_URL = API_SERVER_URL;
    user: User = {
        id: null,
        name: null,
        username: null,
        email: null,
        email_verified_at: null,
        password: null,
        created_at: null,
        updated_at: null

    };

  ngOnInit() {
      this.storage.get('User').then((user)=> {
          if (user) {
              this.user = user;
              this.restaurantService.get_user_top_qi(this.user.id, 'restaurant').subscribe(top_qi_restaurant => {
                  this.top_qi_restaurant = top_qi_restaurant;
              })

              this.user = user;
              this.restaurantService.get_user_top_qi(this.user.id, 'local').subscribe(top_qi_restaurant => {
                  this.top_qi_local = top_qi_restaurant;
              })

          }
      })
  }

}
