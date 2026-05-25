import { Routes } from '@angular/router';

export const STUDENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/student-list/student-list.component').then((m) => m.StudentListComponent),
  },
  {
    path: ':studentId',
    loadComponent: () =>
      import('./components/student-detail/student-detail.component').then(
        (m) => m.StudentDetailComponent,
      ),
  },
];
