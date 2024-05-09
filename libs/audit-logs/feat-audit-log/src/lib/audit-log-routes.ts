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
  {
    path: 'student-audit',
    loadComponent: () =>
      import(
        './student-audit/student-audit-grid/student-audit-grid.component'
      ).then(m => m.StudentAuditGridComponent),
  },
  {
    path: 'student-audit/student-view/:id',
    loadComponent: () =>
      import(
        './student-audit/manage-student-audit/manage-student-audit.component'
      ).then(m => m.ManageStudentAuditComponent),
  },
];
