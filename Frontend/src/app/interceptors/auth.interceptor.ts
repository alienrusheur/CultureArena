import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Ajoute automatiquement "Authorization: Bearer <token>" sur chaque requête
 * sortante vers l'API si l'utilisateur est connecté.
 * Les routes /auth/login et /auth/register n'ont pas besoin du token
 * mais l'ajouter ne pose pas de problème (elles l'ignorent côté backend).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  const reqAvecToken = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(reqAvecToken);
};