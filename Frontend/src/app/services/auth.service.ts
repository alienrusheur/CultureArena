import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
export interface User {
 _id: string;
 nom: string;
 email: string;
 role: 'user' | 'admin';
}
export interface ApiResponse<T> { success: boolean; data: T; }
export interface AuthData { token: string; user: User; }
export interface RegisterPayload { nom: string; email: string;
mot_de_passe: string; }
@Injectable({ providedIn: 'root' })
export class AuthService {
 private readonly http = inject(HttpClient);
 private readonly router = inject(Router);
 private readonly baseUrl = 'http://localhost:3000/auth';
 // Signal : valeur réactive qui notifie les composants quand elle change
 // On les verra en détail dans le cours suivant — ici on les utilise simplement
 private readonly _user = signal<User |
null>(this.lireUserDuStorage());
 // computed : valeur dérivée du signal _user
 readonly user = this._user.asReadonly();
 readonly estConnecte = computed(() => this._user() !== null);
 readonly estAdmin = computed(() => this._user()?.role === 'admin');
 // Lire l'utilisateur stocké au démarrage de l'app
 private lireUserDuStorage(): User | null {
 const str = localStorage.getItem('user');
 if (!str) return null;
 try { return JSON.parse(str) as User; }
 catch { return null; }
 }
 // Se connecter — appelle POST /auth/login
 login(email: string, motDePasse: string):
Observable<ApiResponse<AuthData>> {
 return this.http.post<ApiResponse<AuthData>>(
 `${this.baseUrl}/login`,
 { email, mot_de_passe: motDePasse },
 ).pipe(
 tap(reponse => {
 // Stocker le token et l'utilisateur
 localStorage.setItem('token', reponse.data.token);
 localStorage.setItem('user', JSON.stringify(reponse.data.user));
 // Mettre à jour le signal
 this._user.set(reponse.data.user);
 }),
 );
 }
 // S'inscrire — appelle POST /auth/register
 register(nom: string, email: string, motDePasse: string):
Observable<ApiResponse<User>> {
 const payload: RegisterPayload = { nom, email, mot_de_passe:
motDePasse };
 return this.http.post<ApiResponse<User>>(`${this.baseUrl}/register`,
payload);
 }
// Se déconnecter — nettoyer localStorage et rediriger
 logout(): void {
 localStorage.removeItem('token');
 localStorage.removeItem('user');
 this._user.set(null);
 this.router.navigate(['/login']);
 }
 // Lire le token pour les requêtes HTTP
 getToken(): string | null {
 return localStorage.getItem('token');
 }
}