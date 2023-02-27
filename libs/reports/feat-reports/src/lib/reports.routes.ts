import { Route } from '@angular/router';

export const REPORTS_ROUTES: Route[] = [
  {
    path: ':id',
    loadComponent: () =>
      import('./report-renderer/report-renderer.component').then(
        m => m.ReportRendererComponent
      ),
  },
];
