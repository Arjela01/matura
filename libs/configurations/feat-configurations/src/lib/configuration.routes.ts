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
    path: 'study-subject',
    loadComponent: () =>
      import(
        './study-subject/manage-study-subjects/manage-study-subjects.component'
      ).then(m => m.ManageStudySubjectsComponent),
  },
];
