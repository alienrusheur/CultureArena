import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { Register } from './register/register';
import { AccueilComponent } from './accueil/accueil';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },
  { path: 'accueil', component: AccueilComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];