import { Route } from '@angular/router';

export const CONFIGURATION_ROUTES: Route[] = [
  {
    path: 'high-school',
    loadComponent: () =>
      import(
        './high-schools/manage-high-schools/manage-high-schools.component'
      ).then(m => m.ManageHighSchoolsComponent),
  },
  {
    path: 'profile-group',
    loadComponent: () =>
      import(
        './profile-group/manage-profile-groups/manage-profile-groups.component'
      ).then(m => m.ManageProfileGroupsComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profiles/manage-profiles/manage-profiles.component').then(
        m => m.ManageProfilesComponent
      ),
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
    path: 'administration-offices',
    loadComponent: () =>
      import(
        './administration-office/manage-administration-office/manage-administration-office.component'
      ).then(m => m.ManageAdministrationOfficeComponent),
  },
  {
    path: 'ActivateOverseer-DarZa',
    loadComponent: () =>
      import(
        './activate-overseer-dar-za/manage-activate-overseer-dar-za/manage-activate-overseer-dar-za.component'
      ).then(m => m.ManageActivateOverseerDarZaComponent),
  },
  {
    path: 'diploma-requirement-exemption',
    loadComponent: () =>
      import(
        './diploma-requirement-exemption/manage-diploma-requirement-exemption/manage-diploma-requirement-exemption.component'
        ).then(m => m.ManageDiplomaRequirementExemptionComponent),
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./menus/manage-menus/manage-menus.component').then(
        m => m.ManageMenusComponent
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./reports/manage-reports/manage-reports.component').then(
        m => m.ManageReportsComponent
      ),
  },
  {
    path: 'exam-version',
    loadComponent: () =>
      import(
        './exam-versions/manage-exam-versions/manage-exam-versions.component'
      ).then(m => m.ManageExamVersionsComponent),
  },
  {
    path: 'exam-type',
    loadComponent: () =>
      import('./exam-type/manage-exam-type/manage-exam-type.component').then(
        m => m.ManageExamTypeComponent
      ),
  },
  {
    path: 'region',
    loadComponent: () =>
      import('./regions/manage-regions/manage-regions.component').then(
        m => m.ManageRegionsComponent
      ),
  },
  {
    path: 'university',
    loadComponent: () =>
      import(
        './universities/manage-universities/manage-universities.component'
      ).then(m => m.ManageUniversitiesComponent),
  },
  {
    path: 'university-department',
    loadComponent: () =>
      import(
        './university-departments/manage-university-departments/manage-university-departments.component'
      ).then(m => m.ManageUniversityDepartmentsComponent),
  },
  {
    path: 'exam-subject',
    loadComponent: () =>
      import(
        './exam-subjects/manage-exam-subject/manage-exam-subject.component'
      ).then(m => m.ManageExamSubjectComponent),
  },
  {
    path: 'exam-subject-profile',
    loadComponent: () =>
      import(
        './exam-subject-profiles/manage-exam-profile-subject/manage-exam-subject-profile.component'
      ).then(m => m.ManageExamSubjectProfileComponent),
  },
  {
    path: 'city',
    loadComponent: () =>
      import('./cities/manage-cities/manage-cities.component').then(
        m => m.ManageCitiesComponent
      ),
  },
  {
    path: 'academic-year',
    loadComponent: () =>
      import(
        './academic-year/manage-academic-year/manage-academic-year.component'
      ).then(m => m.ManageAcademicYearComponent),
  },
  {
    path: 'gender',
    loadComponent: () =>
      import('./genders/manage-genders/manage-genders.component').then(
        m => m.ManageGendersComponent
      ),
  },
  {
    path: 'study-subject',
    loadComponent: () =>
      import(
        './study-subject/manage-study-subjects/manage-study-subjects.component'
      ).then(m => m.ManageStudySubjectsComponent),
  },
  {
    path: 'roles',
    loadComponent: () =>
      import('./roles/manage-roles/manage-roles.component').then(
        m => m.ManageRolesComponent
      ),
  },
  {
    path: 'study-program',
    loadComponent: () =>
      import(
        './study-program/manage-study-programs/manage-study-programs.component'
      ).then(m => m.ManageStudyProgramsComponent),
  },
  {
    path: 'user',
    loadComponent: () =>
      import('./users/manage-users/manage-users.component').then(
        m => m.ManageUsersComponent
      ),
  },
  {
    path: 'exam-site',
    loadComponent: () =>
      import('./exam-site/manage-exam-site/manage-exam-site.component').then(
        m => m.ManageExamSiteComponent
      ),
  },
  {
    path: 'a1z-form',
    loadComponent: () =>
      import(
        './a1z-category/a1z-category-form/a1z-category-form.component'
      ).then(m => m.A1zCategoryFormComponent),
  },
  {
    path: 'a1z-category',
    loadComponent: () =>
      import(
        './a1z-category/manage-a1z-categories/manage-a1z-categories.component'
      ).then(m => m.ManageA1zCategoriesComponent),
  },
  {
    path: 'exam-date',
    loadComponent: () =>
      import('./exam-date/manage-exam-date/manage-exam-date.component').then(
        m => m.ManageExamDateComponent
      ),
  },
  {
    path: 'exam-assignment',
    loadComponent: () =>
      import(
        './exam-assignment/manage-exam-assignment/manage-exam-assignment.component'
      ).then(m => m.ManageExamAssignmentComponent),
  },
  {
    path: 'student-ban',
    loadComponent: () =>
      import(
        './student-ban/manage-student-ban/manage-student-ban.component'
      ).then(m => m.ManageStudentBanComponent),
  },
  {
    path: 'empty-site',
    loadComponent: () =>
      import('./empty-site/manage-empty-site/manage-empty-site.component').then(
        m => m.ManageEmptySiteComponent
      ),
  },
  {
    path: 'dashboard-items',
    loadComponent: () =>
      import(
        './dashboard-items/manage-dashboard-items/manage-dashboard-items.component'
      ).then(m => m.ManageDashboardItemsComponent),
  },
  {
    path: 'dashboard-sections',
    loadComponent: () =>
      import(
        './dashboard-sections/manage-dashboard-sections/manage-dashboard-sections.component'
      ).then(m => m.ManageDashboardSectionsComponent),
  },

  {
    path: 'carried-grades',
    loadComponent: () =>
      import(
        './carried-grade/manage-carried-grade/manage-carried-grade.component'
      ).then(m => m.ManageCarriedGradesComponent),
  },
];
