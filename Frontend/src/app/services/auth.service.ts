import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, map, catchError, throwError } from 'rxjs';
import {
  ApiError,
  ApiResponse,
  AuthData,
  LoginPayload,
  RegisterPayload,
  Utilisateur
} from '../models/auth.models';

const API_URL = 'http://localhost:3000/api/auth';

const TOKEN_KEY = 'culturearena_token';
const USER_KEY = 'culturearena_utilisateur';

export class AuthApiError extends Error {
  constructor(public readonly type: string, message: string, public readonly status: number) {
    super(message);
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly utilisateurSig = signal<Utilisateur | null>(this.lireUtilisateurStocke());
  readonly utilisateur = this.utilisateurSig.asReadonly();
  readonly estConnecte = computed(() => this.utilisateurSig() !== null);

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<AuthData> {
    return this.http.post<ApiResponse<AuthData>>(`${API_URL}/register`, payload).pipe(
      map((res) => this.extraireData(res)),
      tap((data) => this.stockerSession(data)),
      catchError((err: HttpErrorResponse) => this.gererErreur(err))
    );
  }

  login(payload: LoginPayload): Observable<AuthData> {
    return this.http.post<ApiResponse<AuthData>>(`${API_URL}/login`, payload).pipe(
      map((res) => this.extraireData(res)),
      tap((data) => this.stockerSession(data)),
      catchError((err: HttpErrorResponse) => this.gererErreur(err))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.utilisateurSig.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // --- Internes ---

  private extraireData(res: ApiResponse<AuthData>): AuthData {
    if (res.success) {
      return res.data;
    }
    const err = res as ApiError;
    throw new AuthApiError(err.type_error, err.message, 400);
  }

  private stockerSession(data: AuthData): void {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.utilisateur));
    this.utilisateurSig.set(data.utilisateur);
  }

  private lireUtilisateurStocke(): Utilisateur | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as Utilisateur) : null;
    } catch {
      return null;
    }
  }

  private gererErreur(err: HttpErrorResponse): Observable<never> {
    const body = err.error as ApiError | undefined;

    if (body && body.type_error && body.message) {
      return throwError(() => new AuthApiError(body.type_error, body.message, err.status));
    }

    const message =
      err.status === 0
        ? "Impossible de contacter le serveur. Vérifiez votre connexion."
        : 'Une erreur inattendue est survenue. Réessayez.';

    return throwError(() => new AuthApiError('network-error', message, err.status));
  }
}