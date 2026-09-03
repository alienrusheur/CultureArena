import { Injectable, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface User {
  _id: string;
  pseudonyme: string;
  email: string;
  role: 'utilisateur' | 'admin';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface AuthData {
  token: string;
  utilisateur: User;
}

export interface RegisterPayload {
  pseudonyme: string;
  email: string;
  motDePasse: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly baseUrl = 'http://localhost:3000/auth';

  private readonly _user = signal<User | null>(
    this.lireUserDuStorage()
  );

  readonly user = this._user.asReadonly();

  readonly estConnecte = computed(() => this._user() !== null);

  readonly estAdmin = computed(() => this._user()?.role === 'admin');

  private estDansLeNavigateur(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private lireUserDuStorage(): User | null {
    if (!this.estDansLeNavigateur()) {
      return null;
    }

    const str = localStorage.getItem('user');

    if (!str) {
      return null;
    }

    try {
      return JSON.parse(str) as User;
    } catch {
      return null;
    }
  }

  login(
    email: string,
    motDePasse: string
  ): Observable<ApiResponse<AuthData>> {

    return this.http.post<ApiResponse<AuthData>>(
      `${this.baseUrl}/login`,
      {
        email,
        motDePasse
      }
    ).pipe(

      tap(reponse => {
        if (!this.estDansLeNavigateur()) {
          return;
        }

        localStorage.setItem('token', reponse.data.token);

        localStorage.setItem(
          'user',
          JSON.stringify(reponse.data.utilisateur)
        );

        this._user.set(reponse.data.utilisateur);
      })
    );
  }

  register(
    pseudonyme: string,
    email: string,
    motDePasse: string
  ): Observable<ApiResponse<AuthData>> {

    const payload: RegisterPayload = {
      pseudonyme,
      email,
      motDePasse
    };

    return this.http.post<ApiResponse<AuthData>>(
      `${this.baseUrl}/register`,
      payload
    );
  }

  logout(): void {
    if (this.estDansLeNavigateur()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    this._user.set(null);

    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.estDansLeNavigateur()) {
      return null;
    }

    return localStorage.getItem('token');
  }
}