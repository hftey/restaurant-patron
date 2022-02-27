import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

    async show(header, message) {
        const alert = await this.alertController.create({

            header: header,
            message: message,
            buttons: ['OK']
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
        console.log('onDidDismiss resolved with role', role);
    }

}
