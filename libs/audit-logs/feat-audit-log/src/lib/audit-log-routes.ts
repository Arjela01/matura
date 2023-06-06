import { Route } from '@angular/router';

export const AUDIT_LOG_ROUTES: Route[] = [

  {
    path: 'general-table',
    loadComponent: () =>
      import('./general-table-grid/general-table-grid.component').then(
        m => m.GeneralTableGridComponent
      ),
  },
  {
    path: 'audit-log-grid',
    loadComponent: () =>
      import('./audit-log-grid/audit-log-grid.component').then(
        m => m.AuditLogGridComponent
      ),
  },

];
