import { Route } from '@angular/router';

export const APPLICATION_ROUTES: Route[] = [
  {
    path: 'a1z',
    loadComponent: () =>
      import('./a1z/manage-a1z/manage-a1z.component').then(
        m => m.ManageA1zComponent
      ),
  },
  {
    path: 'a1z/add',
    loadComponent: () =>
      import('./a1z/a1z-form-add/a1-z-form-add.component').then(
        m => m.A1ZFormAddComponent
      ),
  },
  {
    path: 'a1z/edit/:id',
    loadComponent: () =>
      import('./a1z/a1z-form-edit/a1-z-form-edit.component').then(
        m => m.A1ZFormEditComponent
      ),
  },
  {
    path: 'a1z/for-student/:studentId/add',
    loadComponent: () =>
      import('./a1z/a1z-for-student-add/a1-z-for-student-add.component').then(
        m => m.A1ZForStudentAddComponent
      ),
  },
  {
    path: 'a1z/for-student/:studentId/edit/:id',
    loadComponent: () =>
      import('./a1z/a1z-for-student-edit/a1-z-for-student-edit.component').then(
        m => m.A1ZForStudentEditComponent
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
      import('./a1/a1-form-add/a1-form-add.component').then(
        m => m.A1FormAddComponent
      ),
  },
  {
    path: 'a1/edit/:id',
    loadComponent: () =>
      import('./a1/a1-form-edit/a1-form-edit.component').then(
        m => m.A1FormEditComponent
      ),
  },
  {
    path: 'a1/for-student/:studentId/add',
    loadComponent: () =>
      import('./a1/a1-for-student-add/a1-for-student-add.component').then(
        m => m.A1ForStudentAddComponent
      ),
  },
  {
    path: 'a1/for-student/:studentId/edit/:id',
    loadComponent: () =>
      import('./a1/a1-for-student-edit/a1-for-student-edit.component').then(
        m => m.A1ForStudentEditComponent
      ),
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
    path: 'students/view/:id',
    loadComponent: () =>
      import('./students/students-view/student-view.component').then(
        m => m.StudentViewComponent
      ),
  },
  {
    path: 'students/edit/:id',
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
  {
    path: 'printed-diplomas-foreign-students',
    loadComponent: () =>
      import(
        './diplomas-student/printed-diplomas-foreign-students/printed-diplomas-foreign-students.component'
      ).then(m => m.PrintedDiplomasForeignStudentsComponent),
  },
  {
    path: 'a1z/view/:id',
    loadComponent: () =>
      import('./a1z/a1z-view-only/a1z-view-only.component').then(
        m => m.A1zViewOnlyComponent
      ),
  },
  {
    path: 'a1/view/:id',
    loadComponent: () =>
      import('./a1/a1-view-only/a1-view-only.component').then(
        m => m.A1ViewOnlyComponent
      ),
  },
  {
    path: 'exam-grade-request',
    loadComponent: () =>
      import(
        './exam-grade-request/manage-exam-grade-request/manage-exam-grade-request.component'
        ).then(m => m.ManageExamGradeRequestComponent),
  },
];
