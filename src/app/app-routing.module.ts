import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from './logout/logout.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
    },
    {
        path: 'logout', component: LogoutComponent
    },
  {
    path: 'dashboard',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'experience/:place_id',
    loadChildren: () => import('./experience/experience.module').then( m => m.ExperiencePageModule)
  },
  {
      path: 'experience_by_id/:place_id/:experience_id',
      loadChildren: () => import('./experience/experience.module').then( m => m.ExperiencePageModule)
  },
  {
      path: 'experience_by_id/:place_id/:experience_id/:from_restaurant',
      loadChildren: () => import('./experience/experience.module').then( m => m.ExperiencePageModule)
  },
  {
    path: 'restaurant/:place_id',
    loadChildren: () => import('./restaurant/restaurant.module').then( m => m.RestaurantPageModule)
  },  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'qi-info',
    loadChildren: () => import('./qi-info/qi-info.module').then( m => m.QiInfoPageModule)
  }




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
