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
    path: 'menu',
    loadComponent: () =>
      import('./menus/manage-menus/manage-menus.component').then(
        m => m.ManageMenusComponent
      ),
  },
  {
    path: 'study-program',
    loadComponent: () =>
      import(
        './study-program/manage-study-programs/manage-study-programs.component'
      ).then(m => m.ManageStudyProgramsComponent),
  },
];
