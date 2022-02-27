import {Component, OnInit} from '@angular/core';
import {RestaurantService} from "../services/restaurant.service";
import { API_SERVER_URL } from "../../environments/environment";
import { Storage } from  '@ionic/storage';
import { User } from '.././auth/user';
import { AuthService } from '.././auth/auth.service';
import {AlertService} from "../services/alert.service";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  constructor(private restaurantService: RestaurantService, private alert: AlertService, private storage: Storage, private authService: AuthService) {}

    experiences: any[];
    API_SERVER_URL = API_SERVER_URL;
    user: User;

    ngOnInit() {

        this.storage.get('User').then((user)=> {
            if (user) {
                this.user = user;
                this.restaurantService.get_experience_user(this.user.id).subscribe(experience => {
                    this.experiences = experience;
                })
            }
        })

    }

}
