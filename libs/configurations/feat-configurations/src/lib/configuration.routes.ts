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
    path: 'profile-group',
    loadComponent: () =>
      import('./manage-profile-groups/manage-profile-groups.component').then(
        m => m.ManageProfileGroupComponent
      ),
  },
  {
    path: 'profile-group',
    loadComponent: () =>
      import('./manage-profile-groups/manage-profile-groups.component').then(
        m => m.ManageProfileGroupComponent
      ),
  },
];
