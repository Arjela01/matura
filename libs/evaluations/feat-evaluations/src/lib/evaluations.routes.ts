import {Route} from "@angular/router";

export const EVALUATION_ROUTES: Route[] = [
  {
    path: 'exam-score',
    loadComponent: () =>
      import(
        './exam-scores/manage-exam-scores/manage-exam-scores.component'
        ).then(m => m.ManageExamScoresComponent),
  },
]
