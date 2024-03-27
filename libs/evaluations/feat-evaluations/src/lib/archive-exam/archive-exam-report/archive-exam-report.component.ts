import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { BehaviorSubject, filter, map, of, switchMap } from 'rxjs';
import { ArchiveFormComponent } from '../archive-exam-form/archive-form.component';
import { ArchiveExamGridComponent } from '../archive-exam-grid/archive-exam-grid.component';

import { GlobalToastService } from '@msh/shared/util-shared';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
export class ArchiveExamReportComponent implements OnInit {
  private archiveFolderSubject = new BehaviorSubject<ArchiveFolder | null>(
    null
  );
  archiveFolder$ = this.archiveFolderSubject.asObservable();

  archiveExams$ = this.archiveFolder$.pipe(
    filter(archiveFolder => !!archiveFolder),
    switchMap(archiveFolder =>
      archiveFolder
        ? this.archiveExamApiService.getExamsByFolderId(archiveFolder.id)
        : of(null)
    ),
    map(archiveExam =>
      archiveExam?.isSuccessful
        ? (archiveExam.data as Array<ArchiveExam>)
        : null
    )
  );

  constructor(
    private readonly archiveFolderService: ArchiveFolderApiService,
    private readonly archiveExamApiService: ArchiveExamApiService,
    private readonly route: ActivatedRoute,
    private readonly toastService: GlobalToastService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        filter(paramMap => !!paramMap.get('id')),
        switchMap(paramMap =>
          this.archiveFolderService.getById(paramMap.get('id'))
        ),
        map(response => (response.isSuccessful ? response.data : null))
      )
      .subscribe(response => {
        this.archiveFolderSubject.next(response);
      });
  }

  today = new Date();

  printReport() {
    const div = document.getElementById('content') as HTMLElement;

    const options = {
      scale: 2,
      useCORS: true,
      logging: true,
    };

    html2canvas(div, options)
      .then(canvas => {
        const img = canvas.toDataURL('image/jpeg');
        const doc = new jsPDF('p', 'mm', 'a4');
        const bufferX = 5;
        const bufferY = 25;
        const imgProps = (<any>doc).getImageProperties(img);
        const aspectRatio = imgProps.width / imgProps.height;
        const pdfWidth = 200;
        const pdfHeight = pdfWidth / aspectRatio;

        doc.addImage(img, 'JPEG', bufferX, bufferY, pdfWidth, pdfHeight);

        return doc;
      })
      .then(doc => {
        this.archiveFolderSubject.subscribe(folder => {
          if (folder) {
            doc.save(`dosje-${folder.nr}-${folder.examSubjectName}.pdf`);
          } else {
            this.toastService.showError('Ndodhi një problem!');
          }
        });
      });
  }
}
