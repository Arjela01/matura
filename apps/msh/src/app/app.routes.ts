import { Routes } from '@angular/router';
import { AppLayoutComponent } from '@msh/layout/ui-layout';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
  },
  {
    path: 'denied',
    loadComponent: () =>
      import('@msh/shared/ui-shared').then(
        module => module.AccessDeniedComponent
      ),
  },
  {
    path: '404',
    loadComponent: () =>
      import('@msh/shared/ui-shared').then(module => module.NotFoundComponent),
  },

  {
    path: '**',
    redirectTo: '404',
  },
];
