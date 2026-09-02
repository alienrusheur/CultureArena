import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthApiError, AuthService } from '../services/auth.service';

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

  credentials = { email: '', motDePasse: '' };

  constructor(private authService: AuthService) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || this.isLoading) return;

    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.credentials).subscribe({
      next: (data) => {
        this.isLoading = false;
        console.log('Connecté :', data.utilisateur);
        // TODO: this.router.navigateByUrl('/accueil');
      },
      error: (err: AuthApiError) => {
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