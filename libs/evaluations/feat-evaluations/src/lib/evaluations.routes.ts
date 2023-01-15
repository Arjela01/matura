import {Route} from "@angular/router";

export const EVALUATION_ROUTES: Route[] = [
  {
    path: 'exam-result',
    loadComponent: () =>
      import(
        './exam-results/manage-exam-results/manage-exam-results.component'
        ).then(m => m.ManageExamResultsComponent),
  },
]
