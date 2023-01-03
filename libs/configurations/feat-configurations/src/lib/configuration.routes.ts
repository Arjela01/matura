import { Route } from '@angular/router';

export const CONFIGURATION_ROUTES: Route[] = [
  {
    path: 'high-school',
    loadComponent: () =>
      import('./manage-high-schools/manage-high-schools.component').then(
        m => m.ManageHighSchoolsComponent
      ),
  },
];
