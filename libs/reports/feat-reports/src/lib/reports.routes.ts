import { Route } from '@angular/router';

export const REPORTS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./report-renderer/report-renderer.component').then(
        m => m.ReportRendererComponent
      ),
  },
];
