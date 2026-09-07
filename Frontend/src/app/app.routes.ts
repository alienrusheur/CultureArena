import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { Register } from './register/register';
import { AccueilComponent } from './accueil/accueil';
import { QuizPlayComponent } from './quiz/quiz';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },
  { path: 'accueil', component: AccueilComponent },
  { path: 'quiz/:id', component: QuizPlayComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];