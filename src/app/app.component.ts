import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

    public pages: any = [
        {
            title: 'Dashboard',
            icon: 'home-outline',
            url: '/dashboard'
        },
        {
            title: 'Profile',
            icon: 'person-circle',
            url: '/profile'
        },{
            title: 'Logout',
            icon: 'log-out',
            url: '/logout'
        }
    ];

  constructor() {}


}
