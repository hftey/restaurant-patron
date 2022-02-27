import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject, Subject } from  'rxjs';

import { Storage } from  '@ionic/storage';
import { User } from  './user';
import { AuthResponse } from  './auth-response';

import { AlertService } from "../services/alert.service";
import { API_SERVER_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    authSubject  =  new  BehaviorSubject(false);


  constructor(private  httpClient:  HttpClient, private alert: AlertService,private  storage:  Storage) {
      this.storage.create();
  }

    login_check(user: User): Observable<AuthResponse> {
        return this.httpClient.post(`${API_SERVER_URL}/api/login`, user).pipe(
            tap(async (res: AuthResponse) => {
                console.log("response",res);
            })
        );
    }



    login(user: User): Observable<AuthResponse> {
        return this.httpClient.post(`${API_SERVER_URL}/api/login`, user).pipe(

            tap(async (res: AuthResponse) => {
                if (res.User) {
                    this.storage.set("ACCESS_TOKEN", res.token);
                    this.storage.set("User", res.User);
                    this.authSubject.next(true);
                }
            })
        );
    }

    register(user: User): Observable<any> {
        return this.httpClient.post(`${API_SERVER_URL}/api/register`, user).pipe(
            tap(async (res: any) => {
                this.storage.set("ACCESS_TOKEN", res.token);
                this.storage.set("User", res.User);
            })
        );
    }


    async logout() {
        await this.storage.remove("ACCESS_TOKEN");
        await this.storage.remove("EXPIRES_IN");
        await this.storage.remove("User");
        this.authSubject.next(false);
    }


    isLoggedIn() {
        return this.storage.get('ACCESS_TOKEN').then((token)=>{
            if (token){
                const payload = atob(token.split('.')[1]);
                const parsedPayload = JSON.parse(payload);
                return parsedPayload.exp > Date.now() / 1000;

            }else{
                return false;
            }

        })
    }
}
