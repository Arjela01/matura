import { Route } from '@angular/router';

export const APPLICATION_ROUTES: Route[] = [
  {
    path: 'a1z-form',
    loadComponent: () =>
      import('./a1z/a1z-form/a1z-form.component').then(m => m.A1zFormComponent),
  },
  {
    path: 'a1z-form/:id',
    loadComponent: () =>
      import('./a1z/a1z-form/a1z-form.component').then(m => m.A1zFormComponent),
  },
  {
    path: 'a1z',
    loadComponent: () =>
      import('./a1z/manage-a1z/manage-a1z.component').then(
        m => m.ManageA1zComponent
      ),
  },
  {
    path: 'a1',
    loadComponent: () =>
      import('./a1/manage-a1/manage-a1.component').then(
        m => m.ManageA1Component
      ),
  },
];
