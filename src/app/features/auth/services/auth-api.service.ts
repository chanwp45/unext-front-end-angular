import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../shared/services/api-base.service';
import { LoginRequest, RefreshTokenRequest, TokenResponse } from '../models/auth.model';
import { ApiResponse } from '../../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService extends ApiBaseService {
  login(body: LoginRequest): Observable<ApiResponse<TokenResponse>> {
    console.log('AuthApiService.login called with', body);
    return this.post<TokenResponse>('/v1/auth/login', body);
  }

  refreshToken(body: RefreshTokenRequest): Observable<ApiResponse<TokenResponse>> {
    return this.post<TokenResponse>('/v1/auth/refresh-token', body);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/v1/auth/logout`, {});
  }
}
