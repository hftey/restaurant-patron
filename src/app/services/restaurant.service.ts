import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from  'rxjs';
import { Restaurant, Coordinate } from '../models/restaurants.model';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { API_SERVER_URL } from "../../environments/environment";
import { tap } from  'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RestaurantService {

    constructor(private  httpClient: HttpClient) {}

    update_restaurant(Restaurant): Observable<any> {
        return this.httpClient.post(`${API_SERVER_URL}/api/restaurant/update`, Restaurant).pipe(
            tap(async (res: any) => {
                console.log(res);
            })
        )
    }

    get_restaurant(place_id): Observable<any> {
        return this.httpClient.get(`${API_SERVER_URL}/api/restaurant/get/${place_id}`).pipe(
            tap(async (res: any) => {
                console.log(res);
            })
        )
    }

    get_qi_ultimate(place_id): Observable<any> {
        return this.httpClient.get(`${API_SERVER_URL}/api/restaurant/get_qi_ultimate/${place_id}`).pipe(
            tap(async (res: any) => {
                console.log(res);
            })
        )
    }


    update_experience(Experience): Observable<any> {
        return this.httpClient.post(`${API_SERVER_URL}/api/restaurant/update_experience`, Experience).pipe(
            tap(async (res: any) => {
                console.log(res);
            })
        )
    }

    done_experience(experience_id): Observable<any> {
        return this.httpClient.post(`${API_SERVER_URL}/api/restaurant/done_experience`, {'experience_id':experience_id}).pipe(
            tap(async (res: any) => {
                console.log(res);
            })
        )
    }

    get_experience_by_id(place_id, experience_id): Observable<any> {
        return this.httpClient.get(`${API_SERVER_URL}/api/restaurant/get_experience_by_id/${place_id}/${experience_id}`, ).pipe(
            tap(async (res: any) => {
                console.log(res);
            })
        )
    }

    get_experience(place_id, created_by, created_at): Observable<any> {
        return this.httpClient.get(`${API_SERVER_URL}/api/restaurant/get_experience/${place_id}/${created_by}/${created_at}`, ).pipe(
            tap(async (res: any) => {
                console.log(res);
            })
        )
    }

    get_experience_user(user_id): Observable<any> {
        return this.httpClient.get(`${API_SERVER_URL}/api/restaurant/get_experience_user/${user_id}`, ).pipe(
            tap(async (res: any) => {
                console.log(res);
            })
        )
    }

    get_experience_restaurant(place_id): Observable<any> {
        return this.httpClient.get(`${API_SERVER_URL}/api/restaurant/get_experience_restaurant/${place_id}`, ).pipe(
            tap(async (res: any) => {
                console.log(res);
            })
        )
    }


    get_experience_photo(experiences_id): Observable<any> {
        return this.httpClient.get(`${API_SERVER_URL}/api/restaurant/get_experience_photo/${experiences_id}`, ).pipe(
            tap(async (res: any) => {
                console.log(res);
            })
        )
    }

    delete_experience_photo(experiences_photos_id): Observable<any> {
        return this.httpClient.delete(`${API_SERVER_URL}/api/restaurant/delete_experience_photo/${experiences_photos_id}`, ).pipe(
            tap(async (res: any) => {
                console.log(res);
            })
        )
    }


    get_restaurant_bound(Coordinate): Observable<any> {
        return this.httpClient.post(`${API_SERVER_URL}/api/restaurant/get_restaurant_bound`, {Coordinate: Coordinate}).pipe(
            tap(async (res: any) => {
                console.log(res);
            })
        )
    }





}