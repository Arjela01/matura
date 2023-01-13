import { Route } from '@angular/router';
import {ManageProfilesComponent} from "./profiles/manage-profiles/manage-profiles.component";

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
      import(
        './profiles/manage-profiles/manage-profiles.component'
        ).then(m => m.ManageProfilesComponent),
  },
  {
    path: 'administration-offices',
    loadComponent: () =>
      import(
        './administration-office/manage-administration-office/manage-administration-office.component'
      ).then(m => m.ManageAdministrationOfficeComponent),
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./menus/manage-menus/manage-menus.component').then(
        m => m.ManageMenusComponent
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
      import('./universities/manage-universities/manage-universities.component').then(
        m => m.ManageUniversitiesComponent
      ),
  },
  {
    path: 'university-department',
    loadComponent: () =>
      import('./university-departments/manage-university-departments/manage-university-departments.component').then(
        m => m.ManageUniversityDepartmentsComponent
      ),
  },
  {
    path: 'exam-subject',
    loadComponent: () =>
      import(
        './exam-subjects/manage-exam-subject/manage-exam-subject.component'
      ).then(m => m.ManageExamSubjectComponent),
  },
  {
    path: 'city',
    loadComponent: () =>
      import('./cities/manage-cities/manage-cities.component').then(
        m => m.ManageCitiesComponent
      ),
  },
  {
    path: 'gender',
    loadComponent: () =>
      import(
        './genders/manage-genders/manage-genders.component'
      ).then(m => m.ManageGendersComponent),
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
      import(
        './roles/manage-roles/manage-roles.component'
      ).then(m => m.ManageRolesComponent),
  },
  {
    path: 'study-program',
    loadComponent: () =>
      import(
        './study-program/manage-study-programs/manage-study-programs.component'
      ).then(m => m.ManageStudyProgramsComponent),
  },
];
