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
    path: 'roles',
    loadComponent: () =>
      import(
        './roles/manage-roles/manage-roles.component'
      ).then(m => m.ManageRolesComponent),
  },
];
