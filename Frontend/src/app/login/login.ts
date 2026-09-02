import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthApiError, AuthService } from '../services/auth.service';

type AuthMode = 'login' | 'signup';
type SocialProvider = 'google' | 'facebook';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  mode: AuthMode = 'login';
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  // Champs séparés : le backend attend { pseudonyme, email, motDePasse } en inscription
  // et { email, motDePasse } en connexion (pas de login par pseudonyme).
  credentials = {
    pseudonyme: '',
    email: '',
    motDePasse: ''
  };

  constructor(private authService: AuthService) {}

  setMode(mode: AuthMode): void {
    this.mode = mode;
    this.errorMessage = '';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || this.isLoading) {
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    const requete$ =
      this.mode === 'login'
        ? this.authService.login({
            email: this.credentials.email,
            motDePasse: this.credentials.motDePasse
          })
        : this.authService.register({
            pseudonyme: this.credentials.pseudonyme,
            email: this.credentials.email,
            motDePasse: this.credentials.motDePasse
          });

    requete$.subscribe({
      next: (data) => {
        this.isLoading = false;
        console.log('Authentifié :', data.utilisateur);
        // TODO: rediriger vers la page d'accueil une fois le routing en place,
        // ex. this.router.navigateByUrl('/accueil');
      },
      error: (err: AuthApiError) => {
        this.isLoading = false;
        this.errorMessage = err.message;
      }
    });
  }

  loginWith(provider: SocialProvider): void {
    console.log('Connexion via', provider);
    // TODO: le backend actuel n'expose pas encore de route OAuth ;
    // brancher ici une fois /api/auth/google et /api/auth/facebook disponibles.
  }

  forgotPassword(event: Event): void {
    event.preventDefault();
    console.log('Mot de passe oublié cliqué');
    // TODO: aucune route de réinitialisation n'existe encore côté backend.
  }
}