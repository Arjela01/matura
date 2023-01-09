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
      import('./profile-group/manage-profile-groups/manage-profile-groups.component'
        ).then(
        m => m.ManageProfileGroupsComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import(
        './profiles/manage-profiles/manage-profiles.component'
        ).then(m => m.ManageProfilesComponent),
  },
];
