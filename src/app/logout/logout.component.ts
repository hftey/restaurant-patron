import { Component, OnInit } from '@angular/core';
import { AuthService } from '.././auth/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
      console.log('logout OnInit');
      this.authService.logout().then(result=>{
          this.router.navigate(['login']);
      })

  }

    ionViewWillEnter() {
        console.log('logout viewdidload');
        this.ngOnInit();

    }

}
