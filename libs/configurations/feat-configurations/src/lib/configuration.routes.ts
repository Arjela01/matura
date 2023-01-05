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
    path: 'high-school-v2',
    loadComponent: () =>
      import(
        './high-schools/manage-high-schools-v2/manage-high-schools-v2.component'
      ).then(m => m.ManageHighSchoolsV2Component),
  },
];
