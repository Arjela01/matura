import { Route } from '@angular/router';

export const APPLICATION_ROUTES: Route[] = [
  {
    path: 'a1z-form',
    loadComponent: () =>
      import('./a1z/a1z-form/a1z-form.component').then(m => m.A1zFormComponent),
  },
  {
    path: 'a1z-form/:id',
    loadComponent: () =>
      import('./a1z/a1z-form/a1z-form.component').then(m => m.A1zFormComponent),
  },
  {
    path: 'a1z',
    loadComponent: () =>
      import('./a1z/manage-a1z/manage-a1z.component').then(
        m => m.ManageA1zComponent
      ),
  },

  {
    path: 'a1',
    loadComponent: () =>
      import('./a1/a1-grid/a1-grid.component').then(m => m.A1GridComponent),
  },
  {
    path: 'save-a1',
    loadComponent: () =>
      import('./a1/a1-form/a1-form.component').then(m => m.A1FormComponent),
  },
  {
    path: 'save-a1/:id',
    loadComponent: () =>
      import('./a1/a1-form/a1-form.component').then(m => m.A1FormComponent),
  },
  {
    path: 'failing-students',
    loadComponent: () =>
      import(
        './failingStudents/manage-failing-students/manage-failing-students.component'
      ).then(m => m.ManageFailingStudentsComponent),
  },
];
