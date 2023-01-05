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
    path: 'user',
    loadComponent: () =>
      import('./users/manage-users/manage-users.component').then(
        m => m.ManageUsersComponent
      ),
  },
];
