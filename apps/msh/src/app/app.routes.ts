import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@msh/feat-admin-shell').then(m => m.ADMIN_SHELL_ROUTES),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@msh/auth/feat-auth').then(m => m.LoginComponent),
  },
  {
    path: 'denied',
    loadComponent: () =>
      import('@msh/shared/ui-shared').then(m => m.AccessDeniedComponent),
  },
  {
    path: '404',
    loadComponent: () =>
      import('@msh/shared/ui-shared').then(m => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
