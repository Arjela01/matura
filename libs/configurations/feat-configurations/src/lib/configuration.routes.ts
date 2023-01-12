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
    path: 'menu',
    loadComponent: () =>
      import('./menus/manage-menus/manage-menus.component').then(
        m => m.ManageMenusComponent
      ),
  },
  {
    path: 'region',
    loadComponent: () =>
      import('./regions/manage-regions/manage-regions.component').then(
        m => m.ManageRegionsComponent
      ),
  },
];
