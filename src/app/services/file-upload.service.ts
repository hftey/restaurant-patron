import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from  '@angular/common/http';
import { map } from  'rxjs/operators';
import { API_SERVER_URL } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
    //SERVER_URL: string = "https://file.io/";
    SERVER_URL: string = "https://file.io/";
    constructor(private httpClient: HttpClient) { }

    public upload(formData) {

        return this.httpClient.post<any>(`${API_SERVER_URL}/api/restaurant/update_experience_photo`, formData, {
            reportProgress: true,
            observe: 'events'
        });
    }
}
