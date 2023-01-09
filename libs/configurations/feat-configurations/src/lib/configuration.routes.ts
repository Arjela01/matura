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
    path: 'city',
    loadComponent: () =>
      import(
        './cities/manage-cities/manage-cities.component'
        ).then(m => m.ManageCitiesComponent),
  },
];
