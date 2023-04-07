import { Route } from '@angular/router';

export const REPORTS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./manage-dynamic-reports/manage-dynamic-reports.component').then(
        m => m.ManageDynamicReportsComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./report-renderer/report-renderer.component').then(
        m => m.ReportRendererComponent
      ),
  },
];
