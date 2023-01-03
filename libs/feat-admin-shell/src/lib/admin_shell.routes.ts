import { Route } from '@angular/router';
import { AppLayoutComponent } from '@msh/layout/ui-layout';

export const ADMIN_SHELL_ROUTES: Route[] = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@msh/feat-dashboard').then(m => m.DashboardComponent),
      },
      {
        path: 'configurations',
        loadChildren: () =>
          import('@msh/configurations/feat-configurations').then(
            m => m.CONFIGURATION_ROUTES
          ),
      },
    ],
  },
];
