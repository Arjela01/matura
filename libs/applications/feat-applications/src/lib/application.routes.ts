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
    path: 'a1/add',
    loadComponent: () =>
      import('./a1/a1-form/a1-form.component').then(m => m.A1FormComponent),
  },
  {
    path: 'a1/edit/:id',
    loadComponent: () =>
      import('./a1/a1-form/a1-form.component').then(m => m.A1FormComponent),
  },
  {
    path: 'a1/add-for-student/:student',
    loadComponent: () =>
      import('./a1/a1-form/a1-form.component').then(m => m.A1FormComponent),
  },
  {
    path: 'a1z/add-for-student/:studentId',
    loadComponent: () =>
      import('./a1z/a1z-form/a1z-form.component').then(m => m.A1zFormComponent),
  },
  {
    path: 'confirmed-a1a1z',
    loadComponent: () =>
      import(
        './a1a1zconfirmed/manage-a1a1z-confirmed/manage-a1a1z-confirmed.component'
      ).then(m => m.ManageA1a1zConfirmedComponent),
  },
  {
    path: 'failing-students',
    loadComponent: () =>
      import(
        './failingStudents/manage-failing-students/manage-failing-students.component'
      ).then(m => m.ManageFailingStudentsComponent),
  },
  {
    path: 'manage-failing-students',
    loadComponent: () =>
      import(
        './manageFailingStudents/manage-failing-students/manage-failing-students.component'
      ).then(m => m.ManageFailingStudentsComponent),
  },
  {
    path: 'pass-in-fall',
    loadComponent: () =>
      import(
        './passInFall/manage-pass-in-fall/manage-pass-in-fall.component'
      ).then(m => m.ManagePassInFallComponent),
  },
  {
    path: 'students',
    loadComponent: () =>
        import('./students/manage-students/manage-students.component').then(
            m => m.ManageStudentsComponent
        ),
  },
  {
    path: 'students/add',
    loadComponent: () =>
        import('./students/students-form/students-form.component').then(
            m => m.StudentsFormComponent
        ),
  },
  {
    path: 'student-view/:id',
    loadComponent: () =>
        import('./students/students-view/student-view.component').then(
            m => m.StudentViewComponent
        ),
  },
  {
    path: 'student-edit/:id',
    loadComponent: () =>
        import('./students/students-edit/students-edit.component').then(
            m => m.StudentsEditComponent
        ),
  },
  {
    path: 'student-ban',
    loadComponent: () =>
        import(
            './student-ban/manage-student-ban/manage-student-ban.component'
            ).then(m => m.ManageStudentBanComponent),
  },

  {
    path: 'carried-grades',
    loadComponent: () =>
        import(
            './carried-grade/manage-carried-grade/manage-carried-grade.component'
            ).then(m => m.ManageCarriedGradesComponent),
  },
  {
    path: 'diplomas-student',
    loadComponent: () =>
        import(
            './diplomas-student/manage-diplomas-student/manage-diplomas-student.component'
            ).then(m => m.ManageDiplomasStudentComponent),
  },
  {
    path: 'printed-diplomas',
    loadComponent: () =>
        import(
            './diplomas-student/printed-diplomas/printed-diplomas.component'
            ).then(m => m.PrintedDiplomasComponent),
  },
];
