import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const requeteModifiee = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  const estRouteAuthPublique = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  return next(requeteModifiee).pipe(
    catchError((err) => {
      if (err.status === 401 && token && !estRouteAuthPublique) {
        authService.logout();
      }
      return throwError(() => err);
    })
  );
};