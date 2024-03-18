import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ArchiveExamApiService,
  ArchiveFolderApiService,
} from '@msh/evaluations/data-access-evaluations';
import { ArchiveExam, ArchiveFolder } from '@msh/shared/domain-models';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { Observable, of, switchMap } from 'rxjs';
import { ArchiveFormComponent } from '../archive-exam-form/archive-form.component';
import { ArchiveExamGridComponent } from '../archive-exam-grid/archive-exam-grid.component';
@UntilDestroy()
@Component({
  selector: 'msh-manage-archive-exams',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ArchiveExamGridComponent,
    ToolbarModule,
    RouterLink,
    ArchiveFormComponent,
  ],
  templateUrl: './archive-exam-report.component.html',
  styleUrls: ['./archive-exam-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ArchiveExamReportComponent {
  archiveFolder$: Observable<ArchiveFolder | null> = this.route.paramMap.pipe(
    switchMap(paramMap => {
      const id = paramMap.get('id');
      if (id) {
        return this.archiveFolderService.getById(id).pipe(
          switchMap(archiveFolder => {
            if (archiveFolder.isSuccessful) {
              return of(archiveFolder.data);
            } else {
              return of(null);
            }
          })
        );
      } else {
        return of(null);
      }
    })
  );

  archiveExams$ = this.archiveFolder$.pipe(
    switchMap(archiveFolder => {
      if (archiveFolder) {
        return this.archiveExamApiService
          .getExamsByFolderId(archiveFolder.id)
          .pipe(
            switchMap(archiveExam => {
              if (archiveExam.isSuccessful) {
                console.log(archiveExam.data);
                return of(archiveExam.data as Array<ArchiveExam>);
              } else {
                return of(null);
              }
            })
          );
      } else {
        return of(null);
      }
    })
  );

  today = new Date();

  constructor(
    private readonly archiveFolderService: ArchiveFolderApiService,
    private readonly archiveExamApiService: ArchiveExamApiService,
    private readonly route: ActivatedRoute
  ) {}
}
