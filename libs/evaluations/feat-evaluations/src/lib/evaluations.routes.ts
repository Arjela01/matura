import { Route } from '@angular/router';

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
  {
    path: 'exam-secret-form/:id',
    loadComponent: () =>
      import(
        './exam-secrets/exam-secrets-form/exam-secrets-form.component'
      ).then(m => m.ExamSecretsFormComponent),
  },
  {
    path: 'exam-secret-form',
    loadComponent: () =>
      import(
        './exam-secrets/exam-secrets-form/exam-secrets-form.component'
      ).then(m => m.ExamSecretsFormComponent),
  },
  {
    path: 'exam-grades-grid',
    loadComponent: () =>
      import('./exam-grade-grid/exam-grade-grid.component').then(
        m => m.ExamGradeGridComponent
      ),
  },
  {
    path: 'generate-grades',
    loadComponent: () =>
      import('./generate-grades/generate-grades.component').then(
        m => m.GenerateGradesComponent
      ),
  },
];
