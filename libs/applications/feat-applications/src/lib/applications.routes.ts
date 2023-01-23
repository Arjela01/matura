import { Route } from '@angular/router';

export const APPLICATIONS_ROUTES: Route[] = [
  {
    path: 'a1',
    loadComponent: () =>
      import('./a1/manage-a1/manage-a1.component').then(
        m => m.ManageA1Component
      ),
  },
];
