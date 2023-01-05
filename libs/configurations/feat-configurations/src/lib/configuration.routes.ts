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
    path: 'gender',
    loadComponent: () =>
      import(
        './genders/manage-genders/manage-genders.component'
      ).then(m => m.ManageGendersComponent),
  },
];
