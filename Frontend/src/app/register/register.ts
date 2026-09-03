import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {


  loginWith(provider: 'google' | 'facebook'): void {
    console.log('Connexion via', provider);
  }
  afficherMdp: boolean = false;
  afficherConfirm: boolean = false;
  chargement = false;
  erreur = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  registerForm = this.fb.group({
    pseudonyme: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(8)]],
    confirmation: ['', [Validators.required, Validators.minLength(8)]]
  }, { validators: this.motsDePasseIdentiques });

  get pseudonyme() { return this.registerForm.get('pseudonyme')!; }
  get email() { return this.registerForm.get('email')!; }
  get motDePasse() { return this.registerForm.get('motDePasse')!; }
  get confirmation() { return this.registerForm.get('confirmation')!; }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    const { pseudonyme, email, motDePasse } = this.registerForm.value;

    this.chargement = true;
    this.erreur = '';

    this.authService.register(pseudonyme!, email!, motDePasse!).subscribe({
      next: () => {
        this.chargement = false;
        this.snackBar.open('Inscription réussie ! Connecte-toi.', 'Fermer', { duration: 2500 });
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        console.log('ERREUR INSCRIPTION', err);
        this.chargement = false;
        this.erreur = err.error?.message || "Erreur lors de l'inscription";
      },
    });
  }

  motsDePasseIdentiques(control: AbstractControl): ValidationErrors | null {
    const mdp = control.get('motDePasse')?.value;
    const confirmation = control.get('confirmation')?.value;

    if (mdp && confirmation && mdp !== confirmation) {
      return { motsDePasseIdentiques: true };
    }
    return null;
  }
}