import { Route } from '@angular/router';
import {ManageArchiveExamsComponent} from "./archive-exam/manage-archive-exams/manage-archive-exams.component";

export const EVALUATION_ROUTES: Route[] = [
  {
    path: 'exam-score',
    loadComponent: () =>
      import(
        './exam-scores/manage-exam-scores/manage-exam-scores.component'
      ).then(m => m.ManageExamScoresComponent),
  },
  {
    path: 'archive-exam',
    loadComponent: () =>
      import(
        './archive-exam/manage-archive-exams/manage-archive-exams.component'
      ).then(m => m.ManageArchiveExamsComponent),
  },
  {
    path: 'archive-folder',
    loadComponent: () =>
      import(
        './archive-folder/manage-archive-folders/manage-archive-folders.component'
      ).then(m => m.ManageArchiveFoldersComponent),
  },
  {
    path: 'archive-view/:id',
    loadComponent: () =>
      import(
        './archive-folder/archive-folder-view/archive-folder-view.component'
      ).then(m => m.ArchiveFolderViewComponent),
  },
  {
    path: 'archive-exams/:id',
    loadComponent: () =>
      import(
        './archive-exam/manage-archive-exams/manage-archive-exams.component'
      ).then(m => m.ManageArchiveExamsComponent),
  },
  {
    path: 'archive-folder-cover/:id',
    loadComponent: () =>
      import(
        './archive-folder-cover/manage-archive-folder-cover/manage-archive-folder-cover.component'
      ).then(m => m.ManageArchiveFolderCoverComponent),
  },
];
