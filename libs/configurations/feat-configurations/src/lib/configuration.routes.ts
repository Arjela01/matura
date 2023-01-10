import { Route } from '@angular/router';

export const CONFIGURATION_ROUTES: Route[] = [
  {
    path: 'high-school',
    loadComponent: () =>
      import(
        './high-schools/manage-high-schools/manage-high-schools.component'
      ).then(m => m.ManageHighSchoolsComponent),
  },
  {
    path: 'region',
    loadComponent: () =>
      import(
        './regions/manage-regions/manage-regions.component'
        ).then(m => m.ManageRegionsComponent),
  },
];
