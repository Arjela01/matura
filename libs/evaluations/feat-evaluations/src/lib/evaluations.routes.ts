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
    path: 'archive-exams/report/:id',
    loadComponent: () =>
      import(
        './archive-exam/archive-exam-report/archive-exam-report.component'
      ).then(m => m.ArchiveExamReportComponent),
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
    path: 'table-t',
    loadComponent: () =>
      import('./tableT/tableT-grid.component').then(m => m.TableTGridComponent),
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
    path: 'exam-secret-tabular-data-entry',
    loadComponent: () =>
      import(
        './exam-secrets-tabular-data-entry/manage-exam-secret-tabular-data-entry/manage-exam-secret-tabular-data-entry.component'
      ).then(m => m.ManageExamSecretTabularDataEntryComponent),
  },
  {
    path: 'exam-score-tabular-data-entry',
    loadComponent: () =>
      import(
        './exam-score-tabular-data-entry/manage-exam-score-tabular-data-entry/manage-exam-score-tabular-data-entry.component'
      ).then(m => m.ManageExamScoreTabularDataEntryComponent),
  },
  {
    path: 'exam-scores-folder-mismatch',
    loadComponent: () =>
      import(
        './exam-scores/exam-score-folder-mismatch/exam-score-folder-mismatch.component'
      ).then(m => m.ExamScoreFolderMismatchComponent),
  },
  {
    path: 'exam-secrets-folder-mismatch',
    loadComponent: () =>
      import(
        './exam-secrets/exam-secret-folder-mismatch/exam-secret-folder-mismatch.component'
      ).then(m => m.ExamSecretFolderMismatchComponent),
  },
  {
    path: 'barcode-without-score',
    loadComponent: () =>
      import(
        './barcode-without-score/barcode-without-score-grid/barcode-without-score-grid.component'
      ).then(m => m.BarcodeWithoutScoreGridComponent),
  },
  {
    path: 'diploma-recognition',
    loadComponent: () =>
      import(
        './diploma-recognition/manage-diploma-recognition/manage-diploma-recognition.component'
      ).then(m => m.ManageDiplomaRecognitionComponent),
  },
  {
    path: 'diploma-recognition/add',
    loadComponent: () =>
      import(
        './diploma-recognition/diploma-recognition-application/diploma-recognition-application.component'
      ).then(m => m.DiplomaRecognitionRequestComponent),
  },
  {
    path: 'diploma-recognition/edit/:id',
    loadComponent: () =>
      import(
        './diploma-recognition/diploma-recognition-response/diploma-recognition-response.component'
      ).then(m => m.DiplomaRecognitionResponseComponent),
  },
  {
    path: 'exam-question/:id',
    loadComponent: () =>
      import(
        './exam-questions/manage-exam-questions/manage-exam-questions.component'
      ).then(m => m.ManageExamQuestionsComponent),
  },
  {
    path: 'analytic-scores-without-total',
    loadComponent: () =>
      import(
        './analytic-scores-without-total/analytic-scores-without-total-grid/analytic-scores-without-total-grid.component'
      ).then(m => m.AnalyticScoresWithoutTotalGridComponent),
  },
  {
    path: 'total-scores-without-analytic',
    loadComponent: () =>
      import(
        './total-scores-without-analytic/total-scores-without-analytic-grid/total-scores-without-analytic-grid.component'
      ).then(m => m.TotalScoresWithoutAnalyticGridComponent),
  },
  {
    path: 'exam-question-score',
    loadComponent: () =>
      import(
        './exam-questions-scores/manage-exam-question-score/manage-exam-question-score.component'
      ).then(m => m.ManageExamQuestionsScoreComponent),
  },
  {
    path: 'exam-question-score',
    loadComponent: () =>
      import(
        './exam-questions-scores/manage-exam-question-score/manage-exam-question-score.component'
      ).then(m => m.ManageExamQuestionsScoreComponent),
  },
  {
    path: 'total-analytic-scores-mismatch',
    loadComponent: () =>
      import(
        './total-analytic-score-mismatch/total-analytic-score-mismatch.component'
      ).then(m => m.TotalAnalyticScoreMismatchComponent),
  },
  {
    path: 'analytic-score-edit/:examTypeId/:examSubjectId/:examVariantId/:testNumber/:barcode',
    loadComponent: () =>
      import(
        './edit-analytic-score/manage-analytic-score-edit/manage-analytic-score.component'
      ).then(m => m.ManageAnalyticScoreComponent),
  },
  {
    path: 'analytic-scores-grid',
    loadComponent: () =>
      import(
        './analytic-scores-grid/analytic-scores-grid/analytic-scores-grid.component'
      ).then(m => m.AnalyticScoresGridComponent),
  },
  {
    path: 'exam-secret-without-score',
    loadComponent: () =>
      import(
        './exam-secret-without-score/exam-secret-without-score/exam-secret-without-score.component'
      ).then(m => m.ExamSecretWithoutScoreComponent),
  },
  {
    path: 'exam-secret-lock',
    loadComponent: () =>
      import('./exam-secret-lock/exam-secret-lock.component').then(
        m => m.ExamSecretLockComponent
      ),
  },
];
