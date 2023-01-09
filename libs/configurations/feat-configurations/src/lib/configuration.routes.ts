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
    path: 'exam-version',
    loadComponent: () =>
      import(
        './exam-versions/manage-exam-versions/manage-exam-versions.component'
        ).then(m => m.ManageExamVersionsComponent),
  },
];
