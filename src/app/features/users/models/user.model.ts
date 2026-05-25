export type UserRole = 'ADMIN' | 'STAFF' | 'STUDENT' | 'MODERATOR' | 'USER';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  password?: string;
  role?: UserRole;
  active?: boolean;
}
