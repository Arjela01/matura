import { Route } from '@angular/router';

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
      import('./data-exports/manage-data-exports/manage-data-exports.component').then(
        m => m.ManageDataExportsComponent
      ),
  },
  {
    path: 'view/:id',
    loadComponent: () =>
      import('./report-renderer/report-renderer.component').then(
        m => m.ReportRendererComponent
      ),
  },
];
