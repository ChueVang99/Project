import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BracketComponent } from './bracket/bracket.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: '**',
    component: LoginComponent
  }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
