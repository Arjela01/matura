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
    path: 'exam-type',
    loadComponent: () =>
      import(
        './exam-type/manage-exam-type/manage-exam-type.component'
        ).then(m => m.ManageExamTypeComponent),
  },
];
