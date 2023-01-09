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
    path: 'exam-subject',
    loadComponent: () =>
      import(
        './exam-subjects/manage-exam-subject/manage-exam-subject.component'
        ).then(m => m.ManageExamSubjectComponent),
  },
];
