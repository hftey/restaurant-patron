import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurant } from '../models/restaurants.model';
import { API_SERVER_URL } from "../../environments/environment";
import {RestaurantService} from "../services/restaurant.service";

import { Storage } from  '@ionic/storage';
import {AlertService} from "../services/alert.service";
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage implements OnInit {

  place_id: string;
  restaurant: Restaurant;
  qi_user = {
      name: '',
      username: '',
      highest_points: null
  };
    experiences: any[];
    experiences_user: any[];
    user_points: number;
    API_SERVER_URL = API_SERVER_URL;

  constructor(private route: ActivatedRoute, private router: Router, private restaurantService: RestaurantService, private storage: Storage, private authService: AuthService  ) {
      this.restaurant = {
          name:'',address:'',city:'',state:'',country:'',phone_number:'',lat:null,lng:null,place_id:'',created_at:'',created_by:null,
      };
  }

  ngOnInit() {
      this.user_points = 0;
      this.place_id = this.route.snapshot.paramMap.get("place_id");
      this.restaurantService.get_restaurant(this.place_id).subscribe( restaurant =>{
          this.restaurant = restaurant;
      })

      this.restaurantService.get_qi_ultimate(this.place_id).subscribe( qi_user =>{
          if (qi_user){
              this.qi_user = qi_user;
          }
      })

      this.storage.get('User').then((user)=> {
          if (user) {
              this.restaurantService.get_experience_restaurant(this.place_id, user.id).subscribe(experiences_user => {
                  this.experiences_user = experiences_user;
                  this.experiences_user.forEach(exp => {
                      this.user_points += exp.points;
                  })

              })

          }
      })



      this.restaurantService.get_experience_restaurant(this.place_id).subscribe(experience => {
          this.experiences = experience;

      })
  }

    Back(){
        this.router.navigate(['/dashboard/tabs/tab2']);
    }

    displayPointsToUltimate(){
        if (this.qi_user.highest_points <= 10){
            return (11 - this.user_points);

        }else{
            return (this.qi_user.highest_points - this.user_points);

        }
    }

    share_experience(){
        this.restaurantService.update_restaurant(this.restaurant).subscribe(
            result=>{
                console.log(result)
                this.router.navigate(['/experience_explore/'+this.restaurant.place_id+'/1']);

            },
            error => {
                console.log(error)
            })
    }

    displayQiUser(){
        if (this.qi_user && this.qi_user.highest_points > 10){
            return this.qi_user.name +' ('+this.qi_user.username + ') -' +  " <div class='qi'>"+this.qi_user.highest_points+"</div>";

        }else{
            return 'waiting to be claimed!';

        }
    }

    displayUserQiRanking(points){

      let highest_point = this.qi_user.highest_points;
      let percentage = (points / highest_point) * 100;
      let ranking = '';
      if (points == 0){
          ranking = 'newbie';
      }else if (points > 0 && points <= 10 ){
          ranking = 'novice';
      }else if (points == highest_point){
          ranking = 'ultimate';
      }else if (percentage <= 30){
          ranking = 'inspiring';
      }else if (percentage > 30 && percentage <= 70){
          ranking = 'veteran';
      }else if (percentage > 70){
          ranking = 'supreme';
      }

      if (ranking == 'ultimate'){
          return '<div class="qi ultimate"><img class="qi-crown" src="/assets/icon/crown.png"></div>';

      }else{
          return '<div class="qi '+ranking+'"></div>';

      }
    }

}
