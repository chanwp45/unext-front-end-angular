import { Routes } from '@angular/router';

export const FACULTIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/faculty-list/faculty-list.component').then((m) => m.FacultyListComponent),
  },
];
