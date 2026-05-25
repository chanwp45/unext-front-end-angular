import { Routes } from '@angular/router';

export const CURRICULA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/curriculum-list/curriculum-list.component').then(
        (m) => m.CurriculumListComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/curriculum-detail/curriculum-detail.component').then(
        (m) => m.CurriculumDetailComponent,
      ),
  },
];
