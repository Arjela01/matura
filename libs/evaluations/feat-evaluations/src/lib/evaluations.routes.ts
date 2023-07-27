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
    path: 'exam-score-secret',
    loadComponent: () =>
      import(
        './exam-scores-secrets-grid/exam-scores-secrets-grid.component'
      ).then(m => m.ExamScoresSecretsGridComponent),
  },
  {
    path: 'archive-exam',
    loadComponent: () =>
      import(
        './archive-exam/manage-archive-exams/manage-archive-exams.component'
      ).then(m => m.ManageArchiveExamsComponent),
  },
  {
    path: 'archive-folder',
    loadComponent: () =>
      import(
        './archive-folder/manage-archive-folders/manage-archive-folders.component'
      ).then(m => m.ManageArchiveFoldersComponent),
  },
  {
    path: 'barcode-correction',
    loadComponent: () =>
      import(
        './barcode-correction/manage-barcode-correction/manage-barcode-correction.component'
      ).then(m => m.ManageBarcodeCorrectionComponent),
  },

  {
    path: 'archive-view/:id',
    loadComponent: () =>
      import(
        './archive-folder/archive-folder-view/archive-folder-view.component'
      ).then(m => m.ArchiveFolderViewComponent),
  },
  {
    path: 'archive-exams/:id',
    loadComponent: () =>
      import(
        './archive-exam/manage-archive-exams/manage-archive-exams.component'
      ).then(m => m.ManageArchiveExamsComponent),
  },
  {
    path: 'archive-folder-cover/:id',
    loadComponent: () =>
      import(
        './archive-folder-cover/manage-archive-folder-cover/manage-archive-folder-cover.component'
      ).then(m => m.ManageArchiveFolderCoverComponent),
  },
  {
    path: 'A2-form-annual-grades-view/:id',
    loadComponent: () =>
      import(
        './annual-grades/a2-form-annual-grades-view/a2-form-annual-grades-view.component'
      ).then(m => m.A2FormAnnualGradesViewComponent),
  },
  {
    path: 'annual-grades',
    loadComponent: () =>
      import(
        './annual-grades/annual-grades-grid/annual-grades-grid.component'
      ).then(m => m.AnnualGradesGridComponent),
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
    path: 'calculate-grades',
    loadComponent: () =>
      import('./calculate-grades/calculate-grades.component').then(
        m => m.CalculateGradesComponent
      ),
  },
  {
    path: 'connect-exam-secrets',
    loadComponent: () =>
      import('./connect-exam-secrets/connect-exam-secrets.component').then(
        m => m.ConnectExamSecretsComponent
      ),
  },
  {
    path: 'tabular-grade-report',
    loadComponent: () =>
      import('./tabular-grade-report/tabular-grade-report.component').then(
        m => m.TabularGradeReportComponent
      ),
  },
  {
    path: 'grades-scale',
    loadComponent: () =>
      import(
        './grade-scale/manage-grades-scale/manage-grades-scale.component'
      ).then(m => m.ManageGradesScaleComponent),
  },
  {
    path: 'grades-scale-form/:examSubjectId',
    loadComponent: () =>
      import(
        './grade-scale/grade-scale-action/grade-scale-action.component'
      ).then(m => m.GradeScaleActionComponent),
  },
  {
    path: 'unmatched-exams',
    loadComponent: () =>
      import(
        './unmatched-exams/unmatched-exams-grid/unmatched-exams-grid.component'
      ).then(m => m.UnmatchedExamsGridComponent),
  },
  {
    path: 'exam-copy/list-of-exam-copies',
    loadComponent: () =>
      import('./exam-copy/manage-exam-copy/manage-exam-copy.component').then(
        m => m.ManageExamCopyComponent
      ),
  },
  {
    path: 'exam-secrets-list',
    loadComponent: () =>
      import('./exam-secrets-list/manage-exam-secrets-list/manage-exam-secrets-list.component').then(
        m => m.ManageExamSecretsListComponent
      ),
  },
];
