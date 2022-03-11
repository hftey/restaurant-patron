import { Component, OnInit, ViewChild, ElementRef, Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {RestaurantService} from "../services/restaurant.service";
import { Restaurant } from '../models/restaurants.model';
import {Observable} from "rxjs/internal/Observable";
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API_SERVER_URL } from "../../environments/environment";
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { Storage } from  '@ionic/storage';
import { User } from '.././auth/user';

import { AuthService } from '.././auth/auth.service';
import {AlertService} from "../services/alert.service";

@Injectable()
export class FileSelectTrigger{

    public subject:Subject<any> = new Subject<JSON>();

    public notify(done: boolean) {
        this.subject.next(done);
    }
}

@Component({
  selector: 'app-experience',
  templateUrl: './experience.page.html',
  styleUrls: ['./experience.page.scss'],
  providers: [FileSelectTrigger]
})
export class ExperiencePage implements OnInit {

    place_id: string;
    experience_id: string;
    from_restaurant: string;
    restaurant: Restaurant;
    user: User;
    photoCount: number;

    selectedFiles?: FileList;
    progressInfos: any[] = [];
    message: string[] = [];

    experiences_user: any[];
    user_points: number;

    qiPhotoPartial: boolean;
    qiPhotoComplete: boolean;
    qiComments: boolean;
    qi_user = {
        username: '',
        highest_points: null
    };
    experience = {
        id: null,
        place_id: '',
        rating: 0,
        comment: '',
        updated_at: '',
        created_at: '',
        created_by: null,
        done: false,
        points: 0
    };

    comment = new FormControl('');
    //    previews: string[] = [];
    previews = [];


    imageInfos?: Observable<any>;

    starRated: boolean;
    starRating: number;


    constructor(private route: ActivatedRoute, private restaurantService: RestaurantService, private uploadService: FileUploadService,private storage: Storage,private alert: AlertService,
                private authService: AuthService, private router: Router, public alertController: AlertController, public modalController: ModalController, public fileSelectTrigger: FileSelectTrigger) {
      this.restaurant = {
          name:'',address:'',city:'',state:'',country:'',phone_number:'',lat:null,lng:null,place_id:'',created_at:'',created_by:null,
      };

  }

    async onDoneExperience(){
        const alert = await this.alertController.create({
            cssClass: 'alert-class',
            message: 'Thank you for sharing your experience.',
            buttons: ['OK']
        });

        await this.restaurantService.done_experience(this.experience.id).subscribe( experience =>{
            alert.present();
            this.router.navigate(['/dashboard/tabs/tab3']);
        })
    }

    Back(){
        if (this.from_restaurant){
            this.router.navigate(['/restaurant/'+this.place_id]);

        }else if (this.experience_id){
            this.router.navigate(['/dashboard/tabs/tab3']);

        }else{
            this.router.navigate(['/dashboard']);

        }

    }

    async viewImage(img){
        const modal = await this.modalController.create({
            component: ViewerModalComponent,
            componentProps: {
                src: img
            },
            cssClass: 'ion-img-viewer',
            keyboardClose: true,
            showBackdrop: true
        });

        return await modal.present();
    }

    initPreviews(){
        this.previews = [
            {img:'', img_large:'', width: 50, height: 50, data: new File([""], ""), inProgress: false, progress: 0, id: null},
            {img:'', img_large:'', width: 50, height: 50, data: new File([""], ""), inProgress: false, progress: 0, id: null},
            {img:'', img_large:'', width: 50, height: 50, data: new File([""], ""), inProgress: false, progress: 0, id: null},
            {img:'', img_large:'', width: 50, height: 50, data: new File([""], ""), inProgress: false, progress: 0, id: null},
            {img:'', img_large:'', width: 50, height: 50, data: new File([""], ""), inProgress: false, progress: 0, id: null},
            {img:'', img_large:'', width: 50, height: 50, data: new File([""], ""), inProgress: false, progress: 0, id: null},
            {img:'', img_large:'', width: 50, height: 50, data: new File([""], ""), inProgress: false, progress: 0, id: null},
            {img:'', img_large:'', width: 50, height: 50, data: new File([""], ""), inProgress: false, progress: 0, id: null},
        ];

    }

    initExperience(experience){
        if (experience !== null){

            this.experience = experience;
            this.comment.setValue(this.experience.comment);
            this.starRating = this.experience.rating;
            this.starRated = true;

            this.restaurantService.get_experience_photo(this.experience.id).subscribe(experiences_photo => {

                if (experiences_photo){

                    for (let index = 0; index < experiences_photo.length; index++)
                    {
                        let index_preview = this.previews.findIndex(preview=>preview.img === '');
                        this.previews[index_preview] = {img:`${API_SERVER_URL}/api/restaurant/display_experience_photo/${experiences_photo[index].id}/1`,
                            img_large:`${API_SERVER_URL}/api/restaurant/display_experience_photo/${experiences_photo[index].id}/0`,
                            width:experiences_photo[index].width, height:experiences_photo[index].height, data:new File([""], ""), inProgress: false, progress: 100, id:experiences_photo[index].id};

                    }
                }
                this.fileSelectTrigger.notify(true);
            })
        }
    }

  ngOnInit() {

      this.initPreviews();
      this.place_id = this.route.snapshot.paramMap.get("place_id");
      this.experience_id = this.route.snapshot.paramMap.get("experience_id");
      this.from_restaurant = this.route.snapshot.paramMap.get("from_restaurant");

      this.restaurantService.get_restaurant(this.place_id).subscribe( restaurant =>{
          this.restaurant = restaurant;
      })

      this.starRating = 0;
      this.starRated = false;
      this.comment.setValue('');
      this.user_points = 0;

      this.qiPhotoPartial = false;
      this.qiPhotoComplete = false;
      this.qiComments = false;


      this.fileSelectTrigger.subject.subscribe( msg => {
          this.onCountPoints();
      })

      this.restaurantService.get_qi_ultimate(this.place_id).subscribe( qi_user =>{
          if (qi_user){
              this.qi_user = qi_user;

          }
      })

      this.storage.get('User').then((user)=>{
          if (user){
              this.user = user;
              if (this.experience_id) {
                  this.restaurantService.get_experience_by_id(this.place_id, this.experience_id).subscribe( experience =>{
                      this.initExperience(experience);
                  })
              }else{
                  this.restaurantService.get_experience(this.place_id, this.user.id, new Date().toISOString().slice(0, 19).replace('T', ' ')).subscribe( experience =>{
                      this.initExperience(experience);
                  });

                  this.restaurantService.get_experience_restaurant(this.place_id, user.id).subscribe(experiences_user => {
                      this.experiences_user = experiences_user;
                      console.log('experiences_user', this.experiences_user);
                      this.experiences_user.forEach(exp => {

                          this.user_points += parseInt(exp.points);
                      })

                  })

              }
          }else{
              this.router.navigate(['login']);
          }

      })


  }

    displayPointsToUltimate(){

        if (this.qi_user.highest_points <= 10){
            return (11 - this.user_points);
        }else{
            return (this.qi_user.highest_points - this.user_points);
        }
    }

  onCountPoints(){
    this.experience.points = 0;
    if (this.starRated){
        this.experience.points = this.experience.points + 3;
    }

    this.photoCount = this.previews.filter(preview=> preview.img !== '').length;

    if (this.photoCount > 0 && this.photoCount < 5){
        this.experience.points = this.experience.points + 2;
        this.qiPhotoPartial = true;
        this.qiPhotoComplete = false;
    }else if (this.photoCount >= 5){
        this.experience.points = this.experience.points + 4;
        this.qiPhotoPartial = false;
        this.qiPhotoComplete = true;
    }else{
        this.qiPhotoPartial = false;
        this.qiPhotoComplete = false;

    }

    if (this.comment.value.length > 50){
        this.experience.points = this.experience.points + 3;
        this.qiComments = true;
    }else{
        this.qiComments = false;
    }

  }

  displayQiUser(){
        if (this.qi_user && this.qi_user.highest_points > 10){
            return this.qi_user.username

        }else{
            if (this.experience){
                return 'waiting to be claimed!';

            }else{
                return 'claim the crown!';

            }

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

  onRateChange(rating){
        console.log('on rate change');
        if (!this.starRated){
            this.starRated = true;
            this.experience.points = this.experience.points + 3;
            this.onCountPoints();
        }
  }

  onDeletePhoto(index){
      if (this.previews[index].id){
          this.restaurantService.delete_experience_photo(this.previews[index].id).subscribe( result =>{
              this.restaurantService.get_experience_photo(this.experience.id).subscribe(experiences_photo => {
                  this.initPreviews();
                  if (experiences_photo){

                      for (let index2 = 0; index2 < experiences_photo.length; index2++)
                      {
                          let index_preview = this.previews.findIndex(preview=>preview.img === '');
                          this.previews[index_preview] = {img:`${API_SERVER_URL}/api/restaurant/display_experience_photo/${experiences_photo[index2].id}/1`,
                              img_large:`${API_SERVER_URL}/api/restaurant/display_experience_photo/${experiences_photo[index2].id}/0`,
                              width:experiences_photo[index2].width, height:experiences_photo[index2].height, data:new File([""], ""), inProgress: false, progress: 100, id:experiences_photo[index2].id};
                      }


                  }
                  this.fileSelectTrigger.notify(true);

              })

          })
      }

      this.previews[index] = {img:'', img_large:'', width: 50, height: 50, data: new File([""], ""), inProgress: false, progress: 0, id: null};
      this.fileSelectTrigger.notify(true);
  }

  countPhoto(){
  //  this.photoCount = this.previews.filter(preview=> preview.img !== '').length;
    return this.previews.filter(preview=> preview.img !== '').length;
  }

  classImgSize(width, height){
        if (width == height){
            return 'img_square';
        }else if (width > height){
            return 'img_hor';
        }else{
            return 'img_por';
        }
  }



    onUpdateExperience(){
        let experience_update = {
            id: this.experience.id ? this.experience.id : null,
            place_id: this.place_id,
            rating: this.starRating,
            comment: this.comment.value,
            updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            created_by: this.user.id,
            done: 0,
            points: this.experience.points

        }

        this.restaurantService.update_experience(experience_update).subscribe( experience =>{
            this.experience = experience;

            for (let index = 0; index < this.previews.length; index++)
            {

                if (this.previews[index].img && this.previews[index].progress == 0){

                    const formData = new FormData();
                    formData.append('file', this.previews[index].data);
                    formData.append('experience_id', this.experience.id);
                    formData.append('place_id', this.experience.place_id);
                    formData.append('created_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
                    formData.append('created_by', '1');
                    this.previews[index].inProgress = true;
                    this.uploadService.upload(formData).pipe(
                        map(event => {
                            switch (event.type) {
                                case HttpEventType.UploadProgress:
                                    this.previews[index].progress = Math.round(event.loaded * 100 / event.total);
                                    break;
                                case HttpEventType.Response:
                                    return event;
                            }
                        }),
                        catchError((error: HttpErrorResponse) => {
                            this.previews[index].inProgress = false;
                            return of(`file upload failed.`);
                            return of(`${this.previews[index].data.name} upload failed.`);
                        })).subscribe((event: any) => {
                        if (typeof (event) === 'object') {
                            console.log(event.body);
                        }
                    });

                }
            }

        })
    }

    selectFiles(event: any): void {
        this.message = [];
        this.progressInfos = [];
        this.selectedFiles = event.target.files;

        if (this.selectedFiles && this.selectedFiles[0]) {
            const numberOfFiles = this.selectedFiles.length;
            if (numberOfFiles > 8){
                alert("Max 8 images");
            }else{

                for (let i = 0; i < numberOfFiles; i++) {
                    const reader = new FileReader();

                    reader.onload = (e: any) => {

                        const image = new Image();
                        image.src = e.target.result;
                        image.onload = () => {

                            let index = this.previews.findIndex(preview=>preview.img === '');
                            this.previews[index] = {img:e.target.result, width:image.width, height:image.height, data:this.selectedFiles[i], inProgress: false, progress: 0, id: null};
                            this.fileSelectTrigger.notify(true);

                        };

                    };
                    reader.readAsDataURL(this.selectedFiles[i]);
                }



            }

        }


    }



}
