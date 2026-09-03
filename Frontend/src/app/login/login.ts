import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  credentials = {
    email: '',
    motDePasse: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: NgForm): void {

  if (form.invalid || this.isLoading) return;

  this.errorMessage = '';
  this.isLoading = true;

  this.authService.login(
    this.credentials.email,
    this.credentials.motDePasse
  ).subscribe({

    next: (data) => {
      this.isLoading = false;

      if (data.success) {
        console.log('Connecté :', data.data.utilisateur);
        console.log('Token :', data.data.token);

        this.router.navigateByUrl('/accueil');
      }
    },

    error: (err) => {
      this.isLoading = false;
      this.errorMessage = err.message;
    }

  });
}

  loginWith(provider: 'google' | 'facebook'): void {
    console.log('Connexion via', provider);
  }

  forgotPassword(event: Event): void {
    event.preventDefault();
    console.log('Mot de passe oublié cliqué');
  }
}