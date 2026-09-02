import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  afficherMdp: boolean = false;
  afficherConfirm: boolean = false;
  chargement = false;
  erreur = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  registerForm = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    confirmation: ['', [Validators.required, Validators.minLength(6)]]
  }, { validators: this.motsDePasseIdentiques});

  get nom() { return this.registerForm.get('nom')!; }
  get email() { return this.registerForm.get('email')!; }
  get motDePasse() { return this.registerForm.get('motDePasse')!; }
  get confirmation() { return this.registerForm.get('confirmation')!; }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    const { nom, email, motDePasse } = this.registerForm.value;

    this.chargement = true;
    this.erreur = '';

    this.authService.register(nom!, email!, motDePasse!).subscribe({
      next: () => {
        this.chargement = false;
        this.snackBar.open('Inscription réussie ! Connecte-toi.', 'Fermer', { duration: 2500 });
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.chargement = false;
        this.erreur = err.error?.message || "Erreur lors de l'inscription";
      },
    });
  }

  motsDePasseIdentiques(control: AbstractControl) : ValidationErrors | null {
    const mdp = control.get('motDePasse')?.value;
    const confirmation = control.get('confirmation')?.value;

    if (mdp && confirmation && mdp !== confirmation) {
      return { motsDePasseIdentiques: true };
    }
    return null;
  }
}