import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../shared/services/api-base.service';
import { User, CreateUserRequest, UpdateUserRequest } from '../models/user.model';
import { ApiResponse, PagedResponse } from '../../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class UsersApiService extends ApiBaseService {
  getUsers(page = 1, limit = 20): Observable<PagedResponse<User>> {
    return this.getPaged<User>('/v1/users', { page, limit });
  }

  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.get<User>(`/v1/users/${id}`);
  }

  createUser(body: CreateUserRequest): Observable<ApiResponse<User>> {
    return this.post<User>('/v1/users', body);
  }

  updateUser(id: string, body: UpdateUserRequest): Observable<ApiResponse<User>> {
    return this.patch<User>(`/v1/users/${id}`, body);
  }

  deleteUser(id: string): Observable<ApiResponse<void>> {
    return this.delete<void>(`/v1/users/${id}`);
  }
}
