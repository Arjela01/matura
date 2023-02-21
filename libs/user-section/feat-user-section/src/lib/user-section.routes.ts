import { Route } from '@angular/router';

export const USER_SECTION_ROUTES: Route[] = [
  {
    path: 'user-profile',
    loadComponent: () =>
      import('./user-profile/user-profile.component').then(m => m.UserProfileComponent),
  },
];
