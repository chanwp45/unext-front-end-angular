import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { AuthTokenService } from '../../../shared/services/auth-token.service';
import { LoginRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenService = inject(AuthTokenService);
  private authApi = inject(AuthApiService);
  private router = inject(Router);

  readonly isLoggedIn = signal(this.tokenService.isLoggedIn());

  login(credentials: LoginRequest) {
    return this.authApi.login(credentials).pipe(
      tap((res) => {
        if (res.data) {
          this.tokenService.setTokens(res.data);
          this.isLoggedIn.set(true);
        }
      }),
    );
  }

  logout(): void {
    this.authApi.logout().subscribe({ complete: () => this.clearSession() });
  }

  private clearSession(): void {
    this.tokenService.clearTokens();
    this.isLoggedIn.set(false);
    this.router.navigate(['/auth/login']);
  }
}
