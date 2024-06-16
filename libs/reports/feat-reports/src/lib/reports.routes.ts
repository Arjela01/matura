import { Route } from '@angular/router';
import { EalbaniaGradesDataViewComponent } from './ealbania-grades-data-view/ealbania-grades-data-view.component';
import { EalbaniaMessagesGridComponent } from './ealbania-messages/ealbania-messages-grid.component';

export const REPORTS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import(
        './reports/manage-dynamic-reports/manage-dynamic-reports.component'
      ).then(m => m.ManageDynamicReportsComponent),
  },
  {
    path: 'data-exports',
    loadComponent: () =>
      import(
        './data-exports/manage-data-exports/manage-data-exports.component'
      ).then(m => m.ManageDataExportsComponent),
  },
  {
    path: 'view/:id',
    loadComponent: () =>
      import('./report-renderer/report-renderer.component').then(
        m => m.ReportRendererComponent
      ),
  },
  {
    path: 'a1-view/:id/:reportType',
    loadComponent: () =>
      import(
        './a1-report-view/manage-a1-report-view/manage-a1-report-view.component'
      ).then(m => m.ManageA1ReportViewComponent),
  },
  {
    path: 'current-year-student-grades-data-view',
    loadComponent: () =>
      import(
        './current-year-grades-data-view/current-year-grades-data-view.component'
      ).then(m => m.CurrentYearGradesDataViewComponent),
  },
  {
    path: 'ealbania-student-grades-data-view',
    loadComponent: () =>
      import(
        './ealbania-grades-data-view/ealbania-grades-data-view.component'
      ).then(m => m.EalbaniaGradesDataViewComponent),
  },
  {
      path: 'ealbania-messages',
    loadComponent: () =>
      import(
        './ealbania-messages/ealbania-messages-grid.component'
      ).then(m => m.EalbaniaMessagesGridComponent),
  },
];
