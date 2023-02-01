import {Route} from "@angular/router";

export const EVALUATION_ROUTES: Route[] = [
  {
    path: 'exam-score',
    loadComponent: () =>
      import(
        './exam-scores/manage-exam-scores/manage-exam-scores.component'
        ).then(m => m.ManageExamScoresComponent),
  },
  {
    path: 'exam-secret',
    loadComponent: () =>
      import(
        './exam-secrets/manage-exam-secrets/manage-exam-secrets.component'
        ).then(m => m.ManageExamSecretsComponent),
  },
]
