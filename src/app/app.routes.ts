import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'students',
        loadChildren: () => import('./features/students/students.routes').then((m) => m.STUDENTS_ROUTES),
      },
      {
        path: 'curricula',
        loadChildren: () => import('./features/curricula/curricula.routes').then((m) => m.CURRICULA_ROUTES),
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
      },
      {
        path: 'faculties',
        loadChildren: () => import('./features/faculties/faculties.routes').then((m) => m.FACULTIES_ROUTES),
      },
      { path: '', redirectTo: 'students', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
