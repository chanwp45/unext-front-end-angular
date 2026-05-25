import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthTokenService } from '../services/auth-token.service';
import { AuthApiService } from '../../features/auth/services/auth-api.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(AuthTokenService);
  const authApi = inject(AuthApiService);
  const router = inject(Router);

  const token = tokenService.getAccessToken();
  const authedReq = token ? addToken(req, token) : req;

  return next(authedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/')) {
        const refreshToken = tokenService.getRefreshToken();
        if (refreshToken) {
          return authApi.refreshToken({ refresh_token: refreshToken }).pipe(
            switchMap((res) => {
              tokenService.setTokens(res.data!);
              return next(addToken(req, res.data!.access_token));
            }),
            catchError((refreshError) => {
              tokenService.clearTokens();
              router.navigate(['/auth/login']);
              return throwError(() => refreshError);
            }),
          );
        }
        tokenService.clearTokens();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    }),
  );
};

function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}
